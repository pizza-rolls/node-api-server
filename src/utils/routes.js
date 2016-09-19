/**
 * config/routes.js
 *
 * Utils for routes
 */
const controllers = require('./controllers')
const policies = require('./policies')

module.exports = {
  /**
   * Setup the defined routes with controllers & policies on the app/server
   *
   * @NOTE Iterates routes obj using the keys as paths. Before assigning a path to
   *        be used on the app/server, it first checks to ensure the controller,
   *        controller method, & any policies exist. If all passes, it will assign
   *        using app.use(path, policies, controller.method). A route may be
   *        blocked entirely by simply equaling 'false'. A route can also be a
   *        string|array of policy definitions.
   *
   * Example configs:
   *  '*': {array|string} apply policy(s) to all routes
   *  '/route/path': {
   *    controller: 'name',
   *    method: 'method',
   *    policies: {array|string} policy file name
   *  }
   * @param  {object} server utils.server Class instance { app: express() },
   * @param  {object} api
   *            {
   *              controllers: controllers obj,
   *              services: services obj,
   *              policies: policies obj,
   *              routes: routes obj
   *            }
   * @return {Promise} returns { server:server, api:api }
   */
  setupRoutes: (server, api) => {
    return new Promise((resolve, reject) => {
      if (!server || !api) return reject('setupRoutes() bad params')
      if (!api.routes) return resolve({server: server, api: api})
      // first look for a wildcard route '*' that assigns policy to ALL routes
      if (api.routes['*']) {
        let allRoutePolicy = []
        if (Array.isArray(api.routes['*'])) {
          allRoutePolicy.push(api.routes['*'].map((policy) => {
            if (policies.doesPolicyExist(api.policies, policy)) {
              return policies.getPolicy(api.policies, policy)
            }
            console.log(new Error('policy does not exist: ' + policy))
          }))
        } else {
          allRoutePolicy.push(policies.getPolicy(api.routes['*']))
        }
        server.router.use(allRoutePolicy)
      }

      // iterate routes
      Object.keys(api.routes).forEach((route) => {
        if (route === '*') return

        try {
          // check if route/path should be block entirely
          if (route === false) {
            server.router.all(route, module.exports.blockedRouteHandler())
          }

          let _route = api.routes[route]
          let _controller = api.routes[route].controller
          let _method = api.routes[route].method
          let _policies = api.routes[route].policies
          let _methodExist = controllers.doesControllerMethodExist(api.controllers, _controller, _method)
          const _policyMiddleware = []

          // check if the route is a string|array policy definition
          if (typeof _route === 'string') {
            if (!policies.doesPolicyExist(api.policies, _route)) {
              return console.log(new Error('policy does not exist: ' + _route))
            }

            return server.router.use(policies.getPolicy(api.policies, _route))
          } else if (Array.isArray(_route)) {
            _policyMiddleware.push(_route.map((policy) => {
              if (policies.doesPolicyExist(api.policies, policy)) {
                return policies.getPolicy(api.policies, policy)
              }
              console.log(new Error('policy does not exist: ' + policy))
            }))

            return server.router.use(_policyMiddleware)
          } else if (!_methodExist) {
            return console.log(new Error('controller.method does not exist: ' + _controller + '.' + _method))
          }

          if (Array.isArray(_policies)) {
            _policyMiddleware.push(_policies.map((policy) => {
              if (policies.doesPolicyExist(api.policies, policy)) {
                return policies.getPolicy(api.policies, policy)
              }
              console.log(new Error('policy does not exist: ' + policy))
            }))
          } else if (typeof _policies === 'string') {
            _policyMiddleware.push(policies.getPolicy(api.policies, _policies))
          }

          server.router.all(route, _policyMiddleware, api.controllers[_controller][_method])
        } catch (e) {
          console.log('Bad Route: ' + route + ' in routes config')
          throw new Error(e)
        }
      }) // end of Object.keys loop

      resolve({
        server: server,
        api: api
      })
    })
  },

  /**
   * A req/res handler for a route that is blocked - return 400
   * @return {function}
   */
  blockedRouteHandler: () => {
    return (req, res, next) => {
      return res.statusCode(400).end('Blocked Endpoint')
    }
  },

  /**
   * Check if a route exists by name
   * @param  {object} routes HashMap of routes by name
   * @param  {string} route   The name of the route to check for
   * @return {boolean}
   */
  doesRouteExist: (routes, route) => {
    return !!routes[route]
  },

  /**
   * Get a route method by name
   * @param  {object} routes HashMap of routes by name
   * @param  {string} route   The name of the route to check for
   * @return {function}
   */
  getRoute: (routes, route) => {
    return routes[route]
  }
}

/**
 * utils/controllers.js
 *
 * Utils for controller modules, dir, etc.
 */
const path = require('path')
const utils = require('./utils')
const modules = require('./modules')

module.exports = {
  /**
   * Setup the defined routes with controllers & policies on the app/server
   *
   * @NOTE Iterates the controller modules and creates a route path by controller
   *        filename and method, ie: controller.js has an export myMethod(req,res)
   *        so /controller/myMethod. If the method name is 'index', it will not be
   *        assigned as /controller/index, it will just be /controller/.
   *        If a controller/method path is already defined in a route config that
   *        HAS policies, the method WILL not be setup on the app/server and be skipped.
   *
   * @param  {object} server app/server instance,
   * @param  {object} api
   *            {
   *              controllers: controllers obj,
   *              services: services obj,
   *              policies: policies obj,
   *              routes: routes obj
   *            }
   * @return {Promise} returns { server:server, api:api }
   */
  setupControllers: (server, api) => {
    return new Promise((resolve, reject) => {
      if (!server || !api) return reject('setupControllers() bad params')
      if (!api.controllers) return resolve({server: server, api: api})

      Object.keys(api.controllers).forEach(controllerName => {
        Object.keys(api.controllers[controllerName]).forEach(methodName => {
          if (module.exports.doesControllerMethodHaveRoutePolicies(controllerName, methodName, api.routes)) {
            return
          }

          let handler = api.controllers[controllerName][methodName]
          let path = '/' + controllerName + '/' + methodName

          if (methodName === 'index') {
            path = path.replace('/index', '')
          }

          // setup route
          server.router.all(path, handler)
        })
      })

      resolve({server: server, api: api})
    })
  },

  /**
   * Check if a controller.method exists in the routes config and contains policy
   * @param  {string} controller
   * @param  {string} method
   * @param  {object} routes
   * @return {boolean}
   */
  doesControllerMethodHaveRoutePolicies: (controller, method, routes) => {
    let returnVal = false
    if (routes && typeof routes === 'object') {
      Object.keys(routes).forEach((path) => {
        if (path === '*') return
        let policies = !!(routes[path].policies && routes[path].policies.length)
        returnVal = routes[path].controller === controller && routes[path].method === method && policies
      })
    }
    return returnVal
  },

  /**
   * Load all controller modules in controllers dir into memory via require()
   * @param  {object} config config/controllers.js export
   * @return {Promise}
   */
  loadControllers: (config) => {
    return new Promise((resolve, reject) => {
      const controllersDirDefault = 'api/controllers'
      const controllersDir = utils.makePathFromRoot(config.dir || controllersDirDefault)

      utils.getDirFileNames(controllersDir)
        .then((files) => {
          return files.map((f) => {
            return path.join(controllersDir, f)
          })
        })
        .then((filePaths) => {
          return modules.requireModules(filePaths)
        })
        .then(modules.makeModulesMap)
        .then((hash) => {
          // set global if it's in the config
          if (config.global && typeof config.global === 'string') {
            global[config.global] = hash
          }
          resolve(hash)
        })
        .catch((err) => {
          console.log('error loading controllers')
          console.log(new Error(err))
          reject()
        })
    })
  },

  /**
   * Check if a controller exists by name
   * @param  {object} controllers HashMap of controllers by name
   * @param  {string} controller   The name of the controller to check for
   * @return {boolean}
   */
  doesControllerExist: (controllers, controller) => {
    return !!controllers[controller]
  },

  /**
   * Check if a controller exists by name
   * @param  {object} controllers HashMap of controllers by name
   * @param  {string} controller   The name of the controller to check for
   * @param  {string} method   The name of the controller method to check for
   * @return {boolean}
   */
  doesControllerMethodExist: (controllers, controller, method) => {
    return !!controllers[controller] && controllers[controller][method]
  },

  /**
   * Get a controller method by name
   * @param  {object} controllers HashMap of controllers by name
   * @param  {string} controller   The name of the controller to check for
   * @return {function}
   */
  getController: (controllers, controller) => {
    return controllers[controller]
  }
}

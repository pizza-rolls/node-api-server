/* global Log */

module.exports = (setupCallback) => {
  const utils = require('./utils')

  // dev only
  // console.log('+++ Utils:')
  // console.dir(utils)
  // console.log('\n')

  // instantiate Config
  const config = new utils.config() // eslint-disable-line

  // dev only
  // console.log('+++ Config:')
  // console.dir(config)
  // console.log('\n')

  // setup logger
  config.logger = new utils.logger(config.logger) // eslint-disable-line

  // setup server/app Object
  const server = new utils.server(config.server, config.middleware) // eslint-disable-line

  let api = {
    policies: {},
    controllers: {},
    services: {},
    routes: config.routes,
    server: server
  }

  // read modules into memory: policies, services, controllers
  // then: setup routes, controllers
  Promise
    .all([
      utils.policies.loadPolicies(config.policies),
      utils.services.loadServices(config.services),
      utils.controllers.loadControllers(config.controllers)
    ])
    .then((all) => {
      // assign all to api object outside this scope
      api.policies = all[0]
      api.services = all[1]
      api.controllers = all[2]

      return {
        server: server,
        api: api
      }
    })
    .then(({server, api}) => {
      return utils.routes.setupRoutes(server, api)
    })
    .then(({server, api}) => {
      return utils.controllers.setupControllers(server, api)
    })
    .then(new Promise((resolve, reject) => {
      server.mountRouter()
      return resolve({server, api})
    }))
    .then(({server, api}) => {
      // if there is any additional server setup to do, give a Promise
      return new Promise((resolve, reject) => {
        if (!setupCallback) return resolve()

        const callbackTimer = setTimeout(() => {
          Log.error('The callback was never invoked to start the server')
          Log.error('Stopping process...')
          process.exit()
        }, 20000)

        setupCallback({
          api,
          config
        },
          (...args) => {
            clearTimeout(callbackTimer)
            resolve(...args)
          }
        )
      })
    })
    .then(setupComplete)
    .catch((err) => {
      throw new Error(err)
    })

  // setup js-data-express

  function setupComplete () {
    // start the server
    server.startServer()

    // dev only
    // console.log('+++ Server:')
    // console.dir(`server started on port ${server.port}`)
    // console.log('\n')

    // if (config._args.interactive) {
    //   const repl = require('repl')
    //   Log.debug('Starting Interactive Mode:')
    //   var replServer = repl.start({prompt: '> '})
    //   replServer.context.config = config
    //   replServer.context.api = api
    // }
  }
}

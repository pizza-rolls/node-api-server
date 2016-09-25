/* global Log */

const path = require('path')
const utils = require('./utils')

module.exports = (setupCallback) => {
  // app root directory @TODO make cli arg to set root dir
  const _rootDir = path.join(global.__rootDir || path.parse(process.mainModule.filename).dir)
  // @TODO make cli arg to set config dir
  const _configDir = path.join(_rootDir, '/config')
  // @TODO make cli arg to set api dir
  const _apiDir = path.join(_rootDir, '/api')

  // instantiate Config
  const config = new utils.config({ configDir: _configDir }) // eslint-disable-line

  // setup logger
  config.logger = new utils.logger(config.logger) // eslint-disable-line

  // setup server/app Object
  const server = new utils.server(config.server, config.middleware) // eslint-disable-line

  // load api dir modules into memory
  const api = {
    routes: config.routes,
    server: server
  }
  utils.modules.loadDirFilesAsModules(_apiDir, api)

  // setup routes, controllers
  Promise
    .all([])
    .then(() => {
      utils.globals.setupGlobals({ config: config, api: api })

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

  function setupComplete () {
    // start the server
    server.startServer()
  }
}

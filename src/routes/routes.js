/*
    routes/routes.js
      This is the routes module for the api-server.
 */

const path = require('path')
const ExpressApiServer = require('express-api-routes')

module.exports =
  class Routes {
    constructor (options = {}) {
      const logger = options.context && options.context.logger || ((x) => { console.log(x) })
      const rootDir = options.root || process.cwd()
      const baseRoute = options.baseRoute || '/'

      let routesConfig

      try {
        routesConfig = require(path.join(rootDir, '/config/routes'))
      } catch (e) {
        logger.warn('Unable to find /config/routes.js for a routes config object')
      }

      const apiServer = new ExpressApiServer({

        logger: logger,

        // Root directory
        root: rootDir, // defaults to process.mainModule.filename.dir

        // Base route {optional}
        baseRoute: baseRoute, // defaults to '/'

        // Controllers directory {required} absolute path to controllers dir
        controllers: rootDir + '/controllers', // default if none provided

        // Policies directory {optional} absolute path to policies dir
        policies: rootDir + '/policies', // default if none provided

        // Routes Config Object {optional}
        routes: routesConfig,

        // Express instance {optional}
        app: options.context.app // creates an express app if none provided

      })

      options.context ? options.context.app = apiServer.app : null

      return apiServer
    }
}

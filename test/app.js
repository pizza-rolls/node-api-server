/**
 * This is a dev/test instance of the module..
 */

/* global Log */

const nodeApiServer = require('../src/index')
// import setupJsDataExpress from './utils/js-data-express'

nodeApiServer(({api, config}, startServer) => {
  // Log.verbose('node-api-server version: ' + nodeApiServer.version)
  // setup js-data-express

  // setupJsDataExpress(api, config)

  startServer()
})

/**
 * config/server.js
 *
 * Utils for server
 */
const express = require('express')

module.exports = class Server {
  constructor (options, middleware) {
    this.port = options.port || 3000
    this.baseRoute = options.baseRoute || '/'
    // express app instance
    this.app = options.app || express()
    this.router = new express.Router()
    // bool if server has been started
    this._running = false

    if (middleware) {
      this.addMiddleware(middleware)
    }
  }

  addMiddleware (middleware) {
    this.router.use(middleware)
  }

  mountRouter () {
    this.app.use(this.baseRoute, this.router)
  }

  startServer () {
    if (this._running) return

    try {
      this.app.listen(this.port)
      console.log('server listening on port ' + this.port)
      console.log('router mounted ' + this.baseRoute)
      this._running = true
    } catch (e) {
      this._running = false
    }
  }
}

const express = require('express')
const fs = require('fs')
const path = require('path')
const Logger = require('./logger/logger')
const Routes = require('./routes/routes')
const Middleware = require('./middleware/middleware')

class MODULE {
  constructor (options = {}) {
    this.app = options.app || express()
    this.rootDir = options.rootDir || path.parse(process.mainModule.filename).dir

    const logger = new Logger({ context: this, level: 'silly' }) // eslint-disable-line

    const routes = new Routes({ context: this }) // eslint-disable-line

    const services = this.getServices(options.servicesDir || path.join(this.rootDir, 'services'))

    new Middleware({ context: this, options: options.middleware}) // eslint-disable-line

    return {
      app: this.app,
      logger: logger,
      controllers: routes.controllers,
      policies: routes.policies,
      services: services
    }
  }

  /**
   * Retrieve all services modules & methods and return them in an object format
   * for use.
   */
  getServices (dir) {
    let _services = {}
    let servicesDir

    try {
      servicesDir = fs.statSync(dir)
    } catch (e) { servicesDir = false }

    if (!servicesDir || !servicesDir.isDirectory()) {
      return _services
    }

    fs.readdirSync(dir).forEach((fileName) => {
      if (!/(.js)$/.test(fileName)) {
        return null
      }

      const fileNamespace = fileName.replace('.js', '')

      _services[fileNamespace] = require(path.join(dir, fileName))
    })

    return _services
  }
}

/**
 * Export Our Module
 */
module.exports = MODULE

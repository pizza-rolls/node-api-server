

/*
  utils/js-data-express.js

  This module provides util/helper methods for js-data-express setup and config.
 */

const utils = require('./utils')
const connections = require('../config/connections')

const express = require('express')
const jsData = require('js-data')
const jsDataExpress = require('js-data-express')
const MongoDBAdapter = require('js-data-mongodb')

/**
 * Automate models logic
 *
 * Read through the models modules and instantiate JS-DATA resources for each
 * model module. Use configs in the modules to setup the resources.
 */
module.exports = () => {
  const store = new jsData.DataStore()

  const adapter = new MongoDBAdapter.MongoDBAdapter({
    debug: false,
    uri: 'mongodb://' + connections[global._config.env].mongo.host + ':' + connections[global._config.env].mongo.port + '/' + connections[global._config.env].mongo.database,
    afterCreate(Mapper, props, options, result) {
      console.log(Mapper)
      console.log('\n')
      console.log(props)
      console.log('\n')
      console.log(result)
    }
  })

  store.registerAdapter('mongodb', adapter, { default: true })

  // make store available globally
  _server.store = store

  const apiRoutes = express.Router()

  // Mount queryParser at "/api"
  apiRoutes.use(jsDataExpress.queryParser)

  const models = utils.getModels()

  models.forEach((model) => {
    const resourceName = model.name

    // get model module.mapperConfig object, if it exists
    const resourceConfig = Object.assign({name: resourceName}, model.module.mapperConfig)
    let resource = store.defineMapper(resourceConfig)

    // make resource/model available on global _server.store
    _server.store[resourceName] = resource

    const policyActions = model.module.policies && Object.keys(model.module.policies)
    const policies = model.module.policies
    const config = {
      find: {},
      findAll: {},
      create: {},
      createMany: {},
      update: {},
      updateAll: {},
      updateMany: {},
      destroy: {},
      destroyAll: {}
    }

    if (policyActions && policyActions.length) {
      policyActions.forEach((action) => {
        let method
        if (/find/.test(action)) {
          method = 'get'
        } else if (/create/.test(action)) {
          method = 'post'
        } else if (/update/.test(action)) {
          method = 'put'
        } else if (/destroy/.test(action)) {
          method = 'delete'
        }

        // get polices for action
        let _policies = policies[action]
        if (Array.isArray(_policies)) {
          // multiple policies
          _policies.forEach((p) => {
            if (!checkForPolicy(p)) {
              return
            }

            // add each policy BEFORE the apiRoutes gets added to the express app
            // so the policies intercept before hitting js-data-express endpoints
            _server.app[method](_config.baseRoute + '/' + resourceName + '/*', _server.policies[p])
          })
        } else if (typeof _policies === 'string') {
          // single policy
          if (!checkForPolicy(_policies)) {
            return
          }

          _server.app[method](_config.baseRoute + '/' + resourceName + '/*', _server.policies[_policies])
        } else {
          // it must be 'false' - block route/endpoint
          _server.app[method](_config.baseRoute + '/' + resourceName + '/*', (req, res, next) => {
            return res.status(400).end('Blocked Route')})
        }
      })
    }

    // mount the route
    apiRoutes.use(
      '/' + resourceName,
      new jsDataExpress.Router(resource, config).router
    )
  })

  // mount models/resources
  _server.app.use(_config.baseRoute || '/', apiRoutes)

  return
}

// check if policy exists - return true or false & log msg
function checkForPolicy (p) {
  if (!_server.policies[p]) {
    _server.logger.warn(p + ' policy does not exist')
    return false
  }
  return true
}

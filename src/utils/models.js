/**
 * config/models.js
 *
 * Utils for models
 * @NOTE model files are only loaded as modules when a models directory exists
 * in the api directory and is not required for this module to work properly.
 * Simply a convienence to load the models dir into modules.
 */
const fs = require('fs')
const path = require('path')
const utils = require('./utils')
const modules = require('./modules')

module.exports = {
  /**
   * Load all service modules in models dir into memory via require()
   * @param  {object} config config/models.js export
   * @return {Promise}
   */
  loadModels: (config) => {
    return new Promise((resolve, reject) => {
      const modelsDirDefault = 'api/models'
      const modelsDir = utils.makePathFromRoot(config.dir || modelsDirDefault)

      // check if models dir exists - if not, resolve
      if (!fs.statSync(modelsDir).isDirectory()) {
        resolve({})
      }

      utils.getDirFileNames(modelsDir)
        .then((files) => {
          return files.map((f) => {
            return path.join(modelsDir, f)
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
          console.log('error loading models')
          console.log(new Error(err))
          reject()
        })
    })
  },

  /**
   * Check if a service exists by name
   * @param  {object} models HashMap of models by name
   * @param  {string} service   The name of the service to check for
   * @return {boolean}
   */
  doesModelExist: (models, service) => {
    return !!models[service]
  },

  /**
   * Get a service method by name
   * @param  {object} models HashMap of models by name
   * @param  {string} service   The name of the service to check for
   * @return {function}
   */
  getModel: (models, service) => {
    return models[service]
  }
}

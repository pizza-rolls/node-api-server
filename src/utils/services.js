/**
 * config/services.js
 *
 * Utils for services
 */
const path = require('path')
const utils = require('./utils')
const modules = require('./modules')

module.exports = {
  /**
   * Load all service modules in services dir into memory via require()
   * @param  {object} config config/services.js export
   * @return {Promise}
   */
  loadServices: (config) => {
    return new Promise((resolve, reject) => {
      const servicesDirDefault = 'api/services'
      const servicesDir = utils.makePathFromRoot(config.dir || servicesDirDefault)

      utils.getDirFileNames(servicesDir)
        .then((files) => {
          return files.map((f) => {
            return path.join(servicesDir, f)
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
          console.log('error loading services')
          console.log(new Error(err))
          reject()
        })
    })
  },

  /**
   * Check if a service exists by name
   * @param  {object} services HashMap of services by name
   * @param  {string} service   The name of the service to check for
   * @return {boolean}
   */
  doesServiceExist: (services, service) => {
    return !!services[service]
  },

  /**
   * Get a service method by name
   * @param  {object} services HashMap of services by name
   * @param  {string} service   The name of the service to check for
   * @return {function}
   */
  getService: (services, service) => {
    return services[service]
  }
}

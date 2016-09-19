'use strict';

/**
 * config/services.js
 *
 * Utils for services
 */
var path = require('path');
var utils = require('./utils');
var modules = require('./modules');

module.exports = {
  /**
   * Load all service modules in services dir into memory via require()
   * @param  {object} config config/services.js export
   * @return {Promise}
   */
  loadServices: function loadServices(config) {
    return new Promise(function (resolve, reject) {
      var servicesDirDefault = 'api/services';
      var servicesDir = utils.makePathFromRoot(config.dir || servicesDirDefault);

      utils.getDirFileNames(servicesDir).then(function (files) {
        return files.map(function (f) {
          return path.join(servicesDir, f);
        });
      }).then(function (filePaths) {
        return modules.requireModules(filePaths);
      }).then(modules.makeModulesMap).then(function (hash) {
        // set global if it's in the config
        if (config.global && typeof config.global === 'string') {
          global[config.global] = hash;
        }
        resolve(hash);
      }).catch(function (err) {
        console.log('error loading services');
        console.log(new Error(err));
        reject();
      });
    });
  },

  /**
   * Check if a service exists by name
   * @param  {object} services HashMap of services by name
   * @param  {string} service   The name of the service to check for
   * @return {boolean}
   */
  doesServiceExist: function doesServiceExist(services, service) {
    return !!services[service];
  },

  /**
   * Get a service method by name
   * @param  {object} services HashMap of services by name
   * @param  {string} service   The name of the service to check for
   * @return {function}
   */
  getService: function getService(services, service) {
    return services[service];
  }
};
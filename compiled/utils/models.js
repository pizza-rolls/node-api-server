'use strict';

/**
 * config/models.js
 *
 * Utils for models
 * @NOTE model files are only loaded as modules when a models directory exists
 * in the api directory and is not required for this module to work properly.
 * Simply a convienence to load the models dir into modules.
 */
var fs = require('fs');
var path = require('path');
var utils = require('./utils');
var modules = require('./modules');

module.exports = {
  /**
   * Load all service modules in models dir into memory via require()
   * @param  {object} config config/models.js export
   * @return {Promise}
   */
  loadModels: function loadModels(config) {
    return new Promise(function (resolve, reject) {
      var modelsDirDefault = 'api/models';
      var modelsDir = utils.makePathFromRoot(config.dir || modelsDirDefault);

      // check if models dir exists - if not, resolve
      if (!fs.statSync(modelsDir).isDirectory()) {
        resolve({});
      }

      utils.getDirFileNames(modelsDir).then(function (files) {
        return files.map(function (f) {
          return path.join(modelsDir, f);
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
        console.log('error loading models');
        console.log(new Error(err));
        reject();
      });
    });
  },

  /**
   * Check if a service exists by name
   * @param  {object} models HashMap of models by name
   * @param  {string} service   The name of the service to check for
   * @return {boolean}
   */
  doesModelExist: function doesModelExist(models, service) {
    return !!models[service];
  },

  /**
   * Get a service method by name
   * @param  {object} models HashMap of models by name
   * @param  {string} service   The name of the service to check for
   * @return {function}
   */
  getModel: function getModel(models, service) {
    return models[service];
  }
};
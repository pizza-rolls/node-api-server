'use strict';

/**
 * config/policies.js
 *
 * Utils for policies
 */
var path = require('path');
var utils = require('./utils');
var modules = require('./modules');

module.exports = {
  /**
   * Load all policy modules in policies dir into memory via require()
   * @param  {object} config config/policies.js export
   * @return {Promise}
   */
  loadPolicies: function loadPolicies(config) {
    return new Promise(function (resolve, reject) {
      var policiesDirDefault = 'api/policies';
      var policiesDir = utils.makePathFromRoot(config.dir || policiesDirDefault);

      utils.getDirFileNames(policiesDir).then(function (files) {
        if (!files) return [];
        return files.map(function (f) {
          return path.join(policiesDir, f);
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
        console.log('error loading policies');
        console.log(new Error(err));
        reject();
      });
    });
  },

  /**
   * Check if a policy exists by name
   * @param  {object} policies HashMap of policies by name
   * @param  {string} policy   The name of the policy to check for
   * @return {boolean}
   */
  doesPolicyExist: function doesPolicyExist(policies, policy) {
    return !!policies[policy];
  },

  /**
   * Get a policy method by name
   * @param  {object} policies HashMap of policies by name
   * @param  {string} policy   The name of the policy to check for
   * @return {function}
   */
  getPolicy: function getPolicy(policies, policy) {
    return policies[policy];
  }
};
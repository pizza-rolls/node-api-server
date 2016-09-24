/**
 * config/policies.js
 *
 * Utils for policies
 */
const path = require('path')
const utils = require('./utils')
const modules = require('./modules')

module.exports = {
  /**
   * Load all policy modules in policies dir into memory via require()
   * @param  {object} config config/policies.js export
   * @return {Promise}
   */
  loadPolicies: (config) => {
    return new Promise((resolve, reject) => {
      const policiesDirDefault = 'api/policies'
      const policiesDir = utils.makePathFromRoot(config.dir || policiesDirDefault)

      utils.getDirFileNames(policiesDir)
        .then((files) => {
          if (!files) return []
          return files.map((f) => {
            return path.join(policiesDir, f)
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
          console.log('error loading policies')
          console.log(new Error(err))
          reject()
        })
    })
  },

  /**
   * Check if a policy exists by name
   * @param  {object} policies HashMap of policies by name
   * @param  {string} policy   The name of the policy to check for
   * @return {boolean}
   */
  doesPolicyExist: (policies, policy) => {
    return !!policies[policy]
  },

  /**
   * Get a policy method by name
   * @param  {object} policies HashMap of policies by name
   * @param  {string} policy   The name of the policy to check for
   * @return {function}
   */
  getPolicy: (policies, policy) => {
    return policies[policy]
  }
}

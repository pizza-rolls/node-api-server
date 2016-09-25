/**
 * config/globals.js
 *
 * Configuration & setup for globals
 */

module.exports = {
  setupGlobals: ({ config, api }) => {
    // make api global @TODO evaluate need/use
    // global.api = api

    // controllers
    if (typeof config.controllers.global === 'string') {
      global[config.controllers.global] = api.controllers
    }
    // models
    if (typeof config.models.global === 'string') {
      global[config.models.global] = api.models
    }
    // policies
    if (typeof config.policies.global === 'string') {
      global[config.policies.global] = api.policies
    }
    // services
    if (typeof config.services.global === 'string') {
      global[config.services.global] = api.services
    }
  }
}

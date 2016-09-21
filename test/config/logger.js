/**
 * config/logger.js
 *
 * Configuration for winston logger
 */
module.exports = {
  // if set to string, will set global[string] = logger
  global: 'myLoggerVar',

  // defaults to info
  level: 'silly'
}

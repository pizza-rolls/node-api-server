'use strict';

/**
 * config/jwt.js
 *
 * Configuration for json-web-tokens
 */

module.exports = {
  // how long does the jwt live for // if not falsey, will use session.js expire
  expire: null,

  // defaults to 's3cre3t'
  secret: 'wuhBam'
};
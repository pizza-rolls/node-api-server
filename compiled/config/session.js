'use strict';

/**
 * config/session.js
 *
 * Configuration for sessions
 */

var ms = require('millisecond');

module.exports = {
  // how long does a session live for
  expire: ms('12 hours')
};
'use strict';

/**
 * config/server.js
 *
 * Configuration for web server (express)
 */

var express = require('express');

module.exports = {
  // defaults to '/'
  baseRoute: '/',

  // defaults to express()
  app: express(),

  // defaults to 3000
  port: 3003 // also cli arg option

};
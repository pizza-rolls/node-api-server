/**
 * config/server.js
 *
 * Configuration for web server (express)
 */

const express = require('express')

module.exports = {
  // defaults to '/'
  baseRoute: '/api',

  // defaults to express()
  app: express(),

  // defaults to 3000
  port: 3003 // also cli arg option

}

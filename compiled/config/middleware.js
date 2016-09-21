'use strict';

/**
 * config/middleware.js
 *
 * Middleware to be used in app server
 */
var bodyParser = require('body-parser');

// example custom middleware method
// const customLogger = (req, res, next) => {
//   console.log(`${req.method}:: ${req.path}`)
//   next()
// }

module.exports = [bodyParser.urlencoded({ extended: true }), bodyParser.json()
// customLogger
];
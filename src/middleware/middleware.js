/*
  middleware.js

  This constructor will apply middleware to the express app object. The options
  passed in to the constructor is a middleware options object.
 */

const bodyParser = require('body-parser')

class Middleware {
  constructor (params = {}) {
    params.options || (params.options = {})

    if (params.options.bodyParser !== false) {
      // parse application/x-www-form-urlencoded
      params.context.app.use(bodyParser.urlencoded({ extended: true }))

      // parse application/json
      params.context.app.use(bodyParser.json())
    }
  }
}

module.exports = Middleware

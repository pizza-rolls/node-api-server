/*
  config/connections.js

  This module contains the connection configs for databases

  @NOTE then environment is set and uses connection based on process.env.NODE_ENV
        If no env is set, it's assumed that it's the 'dev' environment
 */
module.exports.production = {
  mongo: {
    host: 'localhost',
    port: 27017,
    database: 'my-dev-db'
  },

  redis: {
    host: 'localhost',
    port: 3003
  }
}

module.exports.dev = {
  mongo: {
    host: 'localhost',
    port: 27017,
    database: 'my-dev-db'
  },

  redis: {
    host: 'localhost',
    port: 3003
  }
}

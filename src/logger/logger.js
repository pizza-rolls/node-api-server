/*
    logger/logger.js
      This is the logger module for the api-server.
 */

const winston = require('winston')

module.exports =
  class Logger {
    constructor (options = {}) {
      const logger = new (winston.Logger)({
        transports: [
          new (winston.transports.Console)({
            colorize: true,
            level: options.level || 'verbose'
          })
          // @TODO add option to write to a file
          //        use multi level for an error file etc https://github.com/winstonjs/winston#multiple-transports-of-the-same-type
          // new (winston.transports.File)({ filename: 'somefile.log' })
        ]
      })

      options.context ? options.context.logger = logger : null

      logger.log('silly', 'Logger initialized')

      return logger
    }
}

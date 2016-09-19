'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * config/logger.js
 *
 * Configuration & setup for logger
 */
var winston = require('winston');

module.exports = function Logger(options) {
  _classCallCheck(this, Logger);

  var logger = makeLogger({
    level: options.level
  });

  if (options.global && typeof options.global === 'string') {
    global[options.global] = logger;
  }

  return logger;
};

var makeLogger = function makeLogger(options) {
  return new winston.Logger({
    transports: [new winston.transports.Console({
      colorize: true,
      level: options.level || 'info'
    })
    // @TODO add option to write to a file
    //        use multi level for an error file etc https://github.com/winstonjs/winston#multiple-transports-of-the-same-type
    // new (winston.transports.File)({ filename: 'somefile.log' })
    ]
  });
};
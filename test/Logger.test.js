const assert = require('assert')

const winston = require('winston')

describe('Logger.test.js', () => {
  it('should instantiate a winston logger', () => {
    assert.ok(config.logger instanceof winston.Logger)
  })

  it('should use config.logger.global string to set a global var', () => {
    assert.ok(global['myLoggerVar'] instanceof winston.Logger)
  })
})

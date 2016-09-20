const assert = require('assert')

describe('Services.test.js - Setup, & Invokation', () => {
  it('should export services dir files as modules', () => {
    assert.ok(typeof api.services === 'object')
    assert.ok(api.services.utilities.myUtilMethod())
  })

  it('should use defined config to set services as a global', () => {
    assert.ok(global[config.services.global].utilities)
  })
})

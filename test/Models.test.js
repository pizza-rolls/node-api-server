const assert = require('assert')

describe('Models.test.js - Setup, & Invokation', () => {
  it('should export models dir files as modules', () => {
    assert.ok(typeof api.models === 'object')
    assert.ok(api.models.userModel.policies)
    assert.ok(api.models.userModel.userMapper)
  })
})

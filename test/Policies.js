const assert = require('assert')

describe('Policies.test.js', () => {
  it('should define policies in api', () => {
    assert.ok(api.policies)
  })

  it('should require policy files into modules', function () {
    assert.ok(api.policies && typeof api.policies.isLoggedIn === 'function')
  })
})

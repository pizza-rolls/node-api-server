const assert = require('assert')

describe('Setup.test.js - Setup, & Invokation', () => {
  it('should be attached to the global config object', () => {
    assert.ok(global.api.server)
  })

  it('should have an instance of express', () => {
    assert.ok(global.api.server.app.use)
    assert.ok(global.api.server.app._router)
  })

  it('should have started the app server', () => {
    assert.ok(global.api.server._running)
  })
})

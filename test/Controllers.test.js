const assert = require('assert')
const request = require('supertest')

const controllers = require('../src/utils/controllers.js')

describe('Controllers.test.js', () => {
  it('should export an object', () => {
    assert.ok(typeof controllers === 'object')
  })

  it('should read our config.controllers', () => {
    assert.ok(config.controllers.global === 'definedGlobalControllers')
  })

  it('should set our controllers globally', () => {
    assert.ok(global['definedGlobalControllers'])
  })

  it('should have read our controller dir files', function () {
    assert.ok(api.controllers.testController)
  })

  it('should have read our controller files methods', function () {
    assert.ok(api.controllers.testController.index)
    assert.ok(api.controllers.testController.testMethod)
  })

  it('should mount controllers method named "index" at the controller filename endpoint', function (done) {
    request(config.server.app)
      .get('/testController')
      .expect(200, 'index method')
      .end((err, res) => {
        if (err) throw err

        done()
      })
  })

  it('should mount controller methods by controller filename / methodname', function (done) {
    request(config.server.app)
      .get('/testController/testMethod')
      .expect(200, 'testMethod!')
      .end((err, res) => {
        if (err) throw err

        done()
      })
  })

  it('should not mount a controller\'s method on the router if it has a route with policies', function (done) {
    request(config.server.app)
      .get('/auth/methodOne')
      .expect(404)
      .end((err, res) => {
        if (err) throw err

        done()
      })
  })
})

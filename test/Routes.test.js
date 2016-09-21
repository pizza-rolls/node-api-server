const assert = require('assert')

const request = require('supertest')

describe('Routes.test.js', () => {
  it('should require routes config as a module', () => {
    assert.ok(typeof api.routes === 'object')
  })

  it('should assign "*" key\'s method as middleware policy on all routes', function (done) {
    request(config.server.app)
      .get('/testController')
      .expect('isLoggedIn', 'true')
      .end((err, res) => {
        if (err) throw err
        // the middleware policy defined for our test sets the header 'isLoggedIn': true
        done()
      })
  })

  it('should invoke a route method & policy as declared in a route object', function (done) {
    request(config.server.app)
      .get('/auth')
      .expect(200)
      .expect('isAdmin', 'true')
      .end((err, res) => {
        if (err) throw err
        // the middleware policy defined for our test sets the header 'isLoggedIn': true
        done()
      })
  })

  it('should block a route that has value false', function (done) {
    // index method in blockedController.js controller
    request(config.server.app)
      .get('/blockedController') // index route
      .expect(400)

    // notAvailableEndpoint method in blockedController.js controller
    request(config.server.app)
      .get('/blockedController/notAvailableEndpoint')
      .expect(400)
      .end((err, res) => {
        if (err) throw err

        assert.ok(!api.controllers.blockedController.index.called)
        assert.ok(!api.controllers.blockedController.notAvailableEndpoint.called)

        done()
      })
  })

  // it('should return `true` when invoked without rules and empty string', function () {
  //   assert.ok(Module({}, ''))
  // })
})

const assert = require('assert')
const fs = require('fs')
const path = require('path')
const sinon = require('sinon')

// The entry point of our module
const Module = require('../src/index.js')

// a setup function that is invoked by the module to give control to perform
// any last minute logic/task before starting the app server
const setupCallback = sinon.spy(({api, config}, callback) => {
  // setup our global api & config object that gets invoked from the module
  global.api = api
  global.config = config

  // setup sinon.spys on controller methods & policy methods
  Object.keys(api.controllers).forEach((c) => {
    Object.keys(api.controllers[c]).forEach((m) => {
      api.controllers[c][m] = sinon.spy(api.controllers[c][m])
    })
  })
  Object.keys(api.policies).forEach((p) => {
    api.policies[p] = sinon.spy(api.policies[p])
  })

  callback()
})

describe('Setup.js - Module Setup/Prep for Tests', () => {
  before((done) => {
    // set our rootDir that the module util looks for
    global.__rootDir = __dirname // here

    // runs before all tests in this block
    Module((api, config, cb) => {
      setupCallback(api, config, cb)
      done()
    })
  })

  it('should invoke the setup callback', () => {
    assert.ok(setupCallback.called)
  })

  it('should have our globals setup', () => {
    assert.ok(typeof global.api === 'object')
    assert.ok(typeof global.config === 'object')
  })

  it('load all tests after setup is complete', () => {
    fs.readdirSync(__dirname).forEach((f) => {
      if (!/test\.js$/i.test(f)) return
      require(path.join(__dirname, f))
    })
  })
})

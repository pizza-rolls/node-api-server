const assert = require('assert')

const Module = require('../src/index.js')

/* global describe, it */

describe('Setup.test.js - Setup, & Invokation', () => {
  it('should export a function', () => {
    assert.ok(typeof Module === 'function')
  })

  // it('should return an Error if invoked without wrong args', function () {
  //   assert.throws(
  //     () => { Module('', {}) },
  //     (err) => { return err instanceof Error },
  //     'unexpected error'
  //   )
  // })
  //
  // it('should return `true` when invoked without rules and empty string', function () {
  //   assert.ok(Module({}, ''))
  // })
})

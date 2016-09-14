var assert = require('assert')

const Module = require('../src/index.js')

/* global describe, it */

describe('Setup.test.js - Setup, Instantiation, & Invokation', function () {
  it('should be a class instantiation', function () {
    assert.ok(new Module())
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

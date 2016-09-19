/**
 * This is the utils/index.js file intended to be the entry point for:
 *  const utils = require('./utils')
 *
 *  Returns a hashmap of all util files in this dir ('./utils')
 *
 * @NOTE utils.js module.exports object is merged into the export
 */

const fs = require('fs')
const path = require('path')

const _utilDir = path.parse(module.filename).dir

let allUtilModules = {}

const utilFiles = fs.readdirSync(_utilDir)

utilFiles.forEach((f) => {
  if (!/\.js$/.test(f)) return

  let filePath = path.join(_utilDir, f)
  f = f.replace('.js', '')

  // intercept the utils.js module into the export
  if (f === 'utils') {
    return Object.assign(allUtilModules, require(filePath))
  }

  allUtilModules[f] = require(filePath)
})

module.exports = allUtilModules

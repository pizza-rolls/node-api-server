/*
  utils.js

  Utility/helper methods for the Server/App
 */

const fs = require('fs')
const path = require('path')

module.exports = {

  isFile: (_path) => {
    let returnVal = false
    let fstat
    try {
      fstat = fs.statSync(_path)
    } catch (e) {}

    if (fstat) {
      returnVal = fstat.isFile()
    }

    return returnVal
  },

  isDirectory: (_path) => {
    let returnVal = false
    let fstat

    try {
      fstat = fs.statSync(_path)
    } catch (e) {}

    if (fstat) {
      returnVal = fstat.isDirectory()
    }
    return returnVal
  },

  /**
   * Make an absolute path relative to the root dir/app
   * @param  {string} path path to append to root path
   * @return {string}
   */
  makePathFromRoot: (_path) => {
    let rootDir
    try {
      // we set __rootDir globally when we want to overwrite the 'rootDir' ie: testing w/ mocha
      rootDir = global.__rootDir || path.parse(process.mainModule.filename).dir
    } catch (e) {
      rootDir = process.cwd()
    }
    return path.join(
      rootDir,
      _path
    )
  },

  /**
   * Get list of filenames in directory (.js only)
   * @param  {string} dir
   * @return {Promise}
   */
  getDirFileNames: (dir) => {
    return new Promise((resolve, reject) => {
      fs.readdir(dir, (err, files) => {
        if (err) return reject(err)
        return resolve(
          // filter for .js files
          files.filter((f) => {
            return /\.js$/.test(f)
          })
        )
      })
    })
  },

  /**
   * Get list of filenames in directory (.js only)
   * @param  {string} dir path
   * @return {Array} files list
   */
  getDirFileNamesSync: (dir) => {
    let files = []

    try {
      files = fs.readdirSync(dir)
    } catch (e) {
      throw new Error(e)
    }

    return files
  }
}

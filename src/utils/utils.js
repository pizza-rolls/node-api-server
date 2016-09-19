/*
  utils.js

  Utility/helper methods for the Server/App
 */

const fs = require('fs')
const path = require('path')

module.exports = {
  /**
   * Make an absolute path relative to the root dir/app
   * @param  {string} path path to append to root path
   * @return {string}
   */
  makePathFromRoot: (_path) => {
    let rootDir
    try {
      rootDir = path.parse(process.mainModule.filename).dir
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
  }
}

/**
 * utils/modules.js
 *
 * Utils for node.js/commonjs modules and interacting with them in the app
 */

const path = require('path')

module.exports = {
  /**
   * Use Node.js require() to get a module and returns a hashMap signature:
   * {
   *  name: fileName,
   *  module: require(...) module
   * }
   * @param  {string} filePath
   * @return {Promise}
   */
  requireModule: (filePath) => {
    return new Promise((resolve, reject) => {
      let _module, _fileName
      try {
        _fileName = path.parse(filePath).name
        _module = require(filePath)
      } catch (e) {
        reject(e)
      }
      const hashMap = {
        name: _fileName,
        module: _module
      }
      return resolve(hashMap)
    })
  },

  requireModules: (filePathList) => {
    return Promise.all(filePathList.map((f) => {
      return module.exports.requireModule(f)
    }))
  },

  /**
   * Makes a HashMap of modules
   *  ie: { fileName: module.exports }
   * @param  {array} modules An array of objs from requireModule()
   * @return {Promise}
   */
  makeModulesMap: (modules) => {
    return new Promise((resolve, reject) => {
      const map = {}

      if (Array.isArray(modules)) {
        modules.forEach((m) => {
          map[m.name] = m.module
        })
      } else {
        reject(new Error('modules is not an array'))
      }

    //   else if (typeof modules === 'object') {
    //    Object.keys(modules).forEach((m) => {
    //      map[modules[m].name] = modules[m].module
    //    })
    //  }

      resolve(map)
    })
  }
}

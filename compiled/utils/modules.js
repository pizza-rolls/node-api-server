'use strict';

/**
 * utils/modules.js
 *
 * Utils for node.js/commonjs modules and interacting with them in the app
 */

var path = require('path');

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
  requireModule: function requireModule(filePath) {
    return new Promise(function (resolve, reject) {
      var _module = void 0,
          _fileName = void 0;
      try {
        _fileName = path.parse(filePath).name;
        _module = require(filePath);
      } catch (e) {
        reject(e);
      }
      var hashMap = {
        name: _fileName,
        module: _module
      };
      return resolve(hashMap);
    });
  },

  requireModules: function requireModules(filePathList) {
    return Promise.all(filePathList.map(function (f) {
      return module.exports.requireModule(f);
    }));
  },

  /**
   * Makes a HashMap of modules
   *  ie: { fileName: module.exports }
   * @param  {array} modules An array of objs from requireModule()
   * @return {Promise}
   */
  makeModulesMap: function makeModulesMap(modules) {
    return new Promise(function (resolve, reject) {
      var map = {};

      if (Array.isArray(modules)) {
        modules.forEach(function (m) {
          map[m.name] = m.module;
        });
      } else {
        reject(new Error('modules is not an array'));
      }

      //   else if (typeof modules === 'object') {
      //    Object.keys(modules).forEach((m) => {
      //      map[modules[m].name] = modules[m].module
      //    })
      //  }

      resolve(map);
    });
  }
};
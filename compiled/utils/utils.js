'use strict';

/*
  utils.js

  Utility/helper methods for the Server/App
 */

var fs = require('fs');
var path = require('path');

module.exports = {
  /**
   * Make an absolute path relative to the root dir/app
   * @param  {string} path path to append to root path
   * @return {string}
   */
  makePathFromRoot: function makePathFromRoot(_path) {
    var rootDir = void 0;
    try {
      rootDir = path.parse(process.mainModule.filename).dir;
    } catch (e) {
      rootDir = process.cwd();
    }
    return path.join(rootDir, _path);
  },

  /**
   * Get list of filenames in directory (.js only)
   * @param  {string} dir
   * @return {Promise}
   */
  getDirFileNames: function getDirFileNames(dir) {
    return new Promise(function (resolve, reject) {
      fs.readdir(dir, function (err, files) {
        if (err) return reject(err);
        return resolve(
        // filter for .js files
        files.filter(function (f) {
          return (/\.js$/.test(f)
          );
        }));
      });
    });
  }
};
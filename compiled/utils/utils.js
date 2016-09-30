'use strict';

/*
  utils.js

  Utility/helper methods for the Server/App
 */

var fs = require('fs');
var path = require('path');

module.exports = {

  isFile: function isFile(_path) {
    var returnVal = false;
    var fstat = void 0;
    try {
      fstat = fs.statSync(_path);
    } catch (e) {}

    if (fstat) {
      returnVal = fstat.isFile();
    }

    return returnVal;
  },

  isDirectory: function isDirectory(_path) {
    var returnVal = false;
    var fstat = void 0;

    try {
      fstat = fs.statSync(_path);
    } catch (e) {}

    if (fstat) {
      returnVal = fstat.isDirectory();
    }
    return returnVal;
  },

  /**
   * Make an absolute path relative to the root dir/app
   * @param  {string} path path to append to root path
   * @return {string}
   */
  makePathFromRoot: function makePathFromRoot(_path) {
    var rootDir = void 0;
    try {
      // we set __rootDir globally when we want to overwrite the 'rootDir' ie: testing w/ mocha
      rootDir = global.__rootDir || path.parse(process.mainModule.filename).dir;
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
  },

  /**
   * Get list of filenames in directory (.js only)
   * @param  {string} dir path
   * @return {Array} files list
   */
  getDirFileNamesSync: function getDirFileNamesSync(dir) {
    var files = [];

    try {
      files = fs.readdirSync(dir);
    } catch (e) {
      throw new Error(e);
    }

    return files;
  }
};
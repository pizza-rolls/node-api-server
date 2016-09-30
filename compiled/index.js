'use strict';

/* global Log */

var path = require('path');
var utils = require('./utils');

var initMethod = function initMethod(setupCallback) {
  // app root directory @TODO make cli arg to set root dir
  var _rootDir = path.join(global.__rootDir || path.parse(process.mainModule.filename).dir);
  // @TODO make cli arg to set config dir
  var _configDir = path.join(_rootDir, '/config');
  // @TODO make cli arg to set api dir
  var _apiDir = path.join(_rootDir, '/api');

  // instantiate Config
  var config = new utils.config({ configDir: _configDir }); // eslint-disable-line

  // setup logger
  config.logger = new utils.logger(config.logger); // eslint-disable-line

  // setup server/app Object
  var server = new utils.server(config.server, config.middleware); // eslint-disable-line

  // load api dir modules into memory
  var api = {
    routes: config.routes,
    server: server
  };
  utils.modules.loadDirFilesAsModules(_apiDir, api);

  // setup routes, controllers
  Promise.all([]).then(function () {
    utils.globals.setupGlobals({ config: config, api: api });

    return {
      server: server,
      api: api
    };
  }).then(function (_ref) {
    var server = _ref.server;
    var api = _ref.api;

    return utils.routes.setupRoutes(server, api);
  }).then(function (_ref2) {
    var server = _ref2.server;
    var api = _ref2.api;

    return utils.controllers.setupControllers(server, api);
  }).then(new Promise(function (resolve, reject) {
    server.mountRouter();
    return resolve({ server: server, api: api });
  })).then(function (_ref3) {
    var server = _ref3.server;
    var api = _ref3.api;

    // if there is any additional server setup to do, give a Promise
    return new Promise(function (resolve, reject) {
      if (!setupCallback) return resolve();

      var callbackTimer = setTimeout(function () {
        Log.error('The callback was never invoked to start the server');
        Log.error('Stopping process...');
        process.exit();
      }, 20000);
      setupCallback({
        api: api,
        config: config
      }, function () {
        clearTimeout(callbackTimer);
        resolve.apply(undefined, arguments);
      });
    });
  }).then(setupComplete).catch(function (err) {
    throw new Error(err);
  });

  function setupComplete() {
    // start the server
    server.startServer();
  }
};

initMethod.version = require('../package.json').version;

module.exports = initMethod;
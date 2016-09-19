'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * config/server.js
 *
 * Utils for server
 */
var express = require('express');

module.exports = function () {
  function Server(options, middleware) {
    _classCallCheck(this, Server);

    this.port = options.port || 3000;
    this.baseRoute = options.baseRoute || '/';
    // express app instance
    this.app = options.app || express();
    this.router = new express.Router();
    // bool if server has been started
    this._running = false;

    if (middleware) {
      this.addMiddleware(middleware);
    }
  }

  _createClass(Server, [{
    key: 'addMiddleware',
    value: function addMiddleware(middleware) {
      this.router.use(middleware);
    }
  }, {
    key: 'mountRouter',
    value: function mountRouter() {
      this.app.use(this.baseRoute, this.router);
    }
  }, {
    key: 'startServer',
    value: function startServer() {
      if (this._running) return;

      try {
        this.app.listen(this.port);
        console.log('server listening on port ' + this.port);
        console.log('router mounted ' + this.baseRoute);
        this._running = true;
      } catch (e) {
        this._running = false;
      }
    }
  }]);

  return Server;
}();
'use strict';

/*
  config/routes.js

  Routes configuration, see express-api-routes docs for config details
 */
module.exports = {
  // Example: will apply to ALL routes
  '*': ['isLoggedIn', 'isAdmin']

};
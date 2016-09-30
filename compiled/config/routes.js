"use strict";

/*
  config/routes.js

  Routes configuration, see express-api-routes docs for config details
 */
module.exports = {
  // // Example: will apply to ALL routes
  // '*': ['isLoggedIn', 'isAdmin'],
  //
  // // define a route "localhost:3003/auth"
  // '/auth': {
  //   controller: 'auth', // the controller filename in api/controllers/ dir
  //   method: 'checkAuthentication', // the name of the method in the controller file
  //   policies: 'isLoggedIn' // policies to run on route before controller.method
  // },
  //
  // // policy string for this route
  // '/auth/isAdmin': 'isAdmin',
  //
  // // policy string for this route with a wildcard
  // // policy will be applied to all routes starting with "/auth/"
  // '/auth/*': 'isLoggedIn',
  //
  // // multiple policy array for this route
  // '/auth/both': ['isAdmin', 'isLoggedIn']
};
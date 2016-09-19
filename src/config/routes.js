/*
  config/routes.js

  Routes configuration, see express-api-routes docs for config details
 */
module.exports = {
  // Example: will apply to ALL routes
  '*': ['isLoggedIn', 'isAdmin'],

  // '/auth': {
  //   controller: 'auth',
  //   method: 'index',
  //   policies: 'isAdmin'
  // },
  // policy string for this route
  // '/auth/isAdmin': 'isAdmin',
  // policy string for this route with a wildcard
  // '/auth/*': 'isLoggedIn',
  // policy array for this route
  // '/auth/both': ['isAdmin', 'isLoggedIn']
}

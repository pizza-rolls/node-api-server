[![npm version](https://badge.fury.io/js/node-api-server.svg)](https://badge.fury.io/js/node-api-server)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

[![Build Status](https://travis-ci.org/pizza-rolls/node-api-server.svg?branch=master)](https://travis-ci.org/pizza-rolls/node-api-server)
[![JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)

[![forthebadge](https://img.shields.io/badge/Node.js-v4-yellow.svg)](http://nodejs.org)
[![forthebadge](https://img.shields.io/badge/Node.js-v6-orange.svg)](http://nodejs.org)

[![forthebadge](https://img.shields.io/badge/Mom%20Made-Pizza%20Rolls-blue.svg)](http://pizza.com)


# Node API Server

Opinionated structure for a node/express API server. Makes setting up and running
a server a breeze with easy config/extendibility. Automatically read controller
files and modules and build `express` routes on your api server instance.

## Usage

`npm i -S node-api-server`


```
const nodeApiServer = require('node-api-server')

nodeApiServer( (api, config, callback) => {
  // "api" & "config" objects are passed as params
  // for use to do any additional tasks here

  // ...setup models/datastore, assign globals, etc.

  // be sure to invoke the callback or the server won't start
  callback()
})
```

> Test your api at `localhost:3003/[controllerFileName]/[methodName]`

Create this directory structure:

- api/
  - controllers/
    - myController.js
  - services/
    - utilService.js
  - policies/
    - isLoggedIn.js
  - models/
    - user.js
- config/
  - connections.js
  - controllers.js
  - globals.js
  - logger.js
  - middleware.js
  - models.js
  - policies.js
  - routes.js
  - server.js
  - services.js
  - session.js
  - socket.js
- app.js

# Directory Structure

Yeah, yeah, it's strongly opinionated... If you think it's a good idea to add the
feature to have the ability to change the directory structure, open an issue on github.

## Directory `/api` (required)

The api directory has sub-directories:

- api/controllers
- api/policies
- api/services {optional}
- api/models {optional}

The files in each of these directories is read into module form via commonjs and
available on the `api` param passed in the callback.

### Directory `api/controllers` (required)
##### _Automatic-Controller-Routes_

This is where the "magic" (yeah right) happens. You get API routes based on the
`.js` files you put in the `api/controllers` dir!

```
api/controllers/
  myController.js // localhost:3003/myController/..[controller methods routes]
  anotherRoute.js // localhost:3003/anotherRoute/..[controller methods routes]
```

All `.js` files in the `api/controllers/` dir will automatically create routes
from the file name and appending each method in the file's `module.exports` object
after that on the route/path.

api/controllers/myController.js

```js
module.exports = {
  index: (req, res, next) => {
    return res.send('this is the index route, localhost:3003/myController/')
  },
  randomRoute: (req, res, next) => {
    return res.send('this is a random route, localhost:3003/myController/randomRoute')
  }
}
```

> Any controller method defined in the `config/routes.js` that have policy(s)
assigned to it - will NOT be automatically mounted on the express router

### Directory `api/policies` (required)
##### _Route Middleware_

All `.js` files in the `api/policies` dir will be read into the `api` object and
be available to be used in `config/routes.js` (_see config/routes.js below_). A
policy module should export a middleware method.

api/policies/isLoggedIn.js

```js
module.exports = (req, res, next) => {
  if (req.cookies.isLoggedIn) {
    return next()
  } else {
    return res.status(403).end()
  }
}
```

### Directory `api/services` (optional)
##### _Backend Utilities/Services_

All `.js` files in the `api/services` dir will be read into the `api` object as
modules by file name. You can put whatever exports you like in service modules.

A file `api/services/utilityService.js` will be available on the `api` object as
`api.services.utilityService`.

> You can make your service modules available globally via `config/services.js`
see config below. This is great for making them available in your controllers
for utility/helper, etc. operations.

### Directory `api/models` (optional)
##### _Helper/Convenience Directory for DataStore_

All `.js` files in the `api/models` dir will be read into the `api` object as
modules by file name.

A file `api/models/userModel.js` will be available on the `api` object as
`api.models.userModel`.

> You can make your models available globally via `config/models.js` see config below.

> You can implement any sort of logic here you would like to be used for datastore
operations or database queries, etc.. If you're interested in a quick and extendible
solution, checkout our project `js-data-api-server` that has a full datastore setup
ready to go

## Directory `config/` (optional)

All `.js` files in the config directory are loaded as modules and available on
the `config` object in the callback. _See below for config files use and options_

# Config

Config files are used to over-ride default `node-api-server` configuration and also
provide helper/util meta info for your API. There are no required config files to
use `node-api-server` and you can start and run your api server without this directory.

Each config file in the `config/` dir will be available on the `config` object
by filename, ie: `config/connections.js` will be available as `config.connections`.

> NOTE: `config/` dir modules are loaded into memory first. This means it's available on
the global scope in your controllers, policies, services, models, etc..

## Config `config/connections.js` (optional)

This module is NOT required. If you do chose to use it, it can be great for defining
this like your database connections or even different connections per env.

Example `config/connections.js`

```js
module.exports = {
  mongoDB: {
    host: (process.env.NODE_ENV === 'production') ? '198.xx.22.x' : 'localhost',
    port: 27017,
    user: 'username',
    pass: 'password',
    database: 'myDB'
  }
}
```

## Config `config/controllers.js` (optional)

This file is used to over-ride default configuration.

```js
module.exports = {
  // global string controller modules will be available as
  global: 'Controllers'
}
```

## Config `config/globals.js` (optional)

```
// @TODO
```

## Config `config/logger.js` (optional)

This is the global logger used (Winston.js) and options here over-ride defaults.

> Winston is the logger used in `node-api-server`

```js

// @TODO add option to write to a file/dir
// @TODO add option to use specified transport

module.exports = {
  // if set to string, will set global[string] = logger
  global: 'Log',

  // defaults to info
  level: 'silly'
}
```

## Config `config/middleware.js` (optional)

Define any middleware you would like to use on the express api server.

> The default is `body-parser`, if you define any new middleware it will overwrite
`body-parser` so you must be sure to include it if you plan on parsing form/query
data in your api

> `config/middleware.js` must export an array if you're defining middleware. Each
middleware will be used in the order listed in the exports array.

```js
const bodyParser = require('body-parser')

// example custom middleware method
const customLogger = (req, res, next) => {
  console.log(`${req.method}:: ${req.path}`)
  next()
}

module.exports = [
  bodyParser.urlencoded({ extended: true }),
  bodyParser.json(),
  customLogger
]
```

## Config `config/models.js` (optional)

This file is used to over-ride default configuration.

```js
module.exports = {
  // global string model modules will be available as
  global: 'Models'
}
```

## Config `config/policies.js` (optional)

This file is used to over-ride default configuration.

```js
module.exports = {
  // global string policy modules will be available as
  global: 'Policies'
}
```

## Config `config/routes.js` (optional)

Some more awesome route "magic" (yeah right)! Define custom routes and controller
methods to use.

Every key will be a route with the assigned `controller`.`method` and any policies
applied as middleware before reaching the `controller`.`method`.

"`*`" key is only used if you want to apply middleware to ALL routes on your
api server.

Key definitions take the following:

`Object`:
```
{
  controller: [api/controllers/filename],
  method: [method name in controller],
  policies: {String|Array}
}
```

`String`: Policy name (filename in api/policies dir)

`Array`: Policy names

Example:

```js
module.exports = {
  // Example: will apply to ALL routes
  '*': ['isLoggedIn', 'isAdmin'],

  // define a route "localhost:3003/auth"
  '/auth': {
    controller: 'auth', // the controller filename in api/controllers/ dir
    method: 'checkAuthentication', // the name of the method in the controller file
    policies: 'isLoggedIn' // policies to run on route before controller.method
  },

  // policy string for this route
  '/auth/isAdmin': 'isAdmin',

  // policy string for this route with a wildcard
  // policy will be applied to all routes starting with "/auth/"
  '/auth/*': 'isLoggedIn',

  // multiple policy array for this route
  '/auth/both': ['isAdmin', 'isLoggedIn']
}```

## Config `config/server.js` (optional)

This file is used to over-ride default server configuration.

```js
const express = require('express')

module.exports = {
  // defaults to '/'
  baseRoute: '/api',

  // defaults to express()
  app: express(),

  // defaults to 3003
  port: 3003 // also cli arg option: -p XXXX

}
```

## Config `config/services.js` (optional)

This file is used to over-ride default configuration.

```js
module.exports = {
  // global string policy modules will be available as
  global: 'Services'
}
```

## Config `config/session.js` (optional)

```js
// @TODO
```

## Config `config/sockets.js` (optional)

```js
// @TODO
```

-------------------------------------------

// @FEATURE/TODO make directory reading recursive for sub dirs
// @TODO add readme.md for each directory and the optional configs that can be used
// @TODO add example files and example repo to pull and get started with
// @TODO setup sockets for routes

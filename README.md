[![npm version](https://badge.fury.io/js/node-api-server.svg)](https://badge.fury.io/js/node-api-server)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

[![Build Status](https://travis-ci.org/pizza-rolls/node-api-server.svg?branch=master)](https://travis-ci.org/pizza-rolls/node-api-server)
[![JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)

[![forthebadge](https://img.shields.io/badge/Node.js-v6-orange.svg)](http://nodejs.org)

[![forthebadge](https://img.shields.io/badge/Mom%20Made-Pizza%20Rolls-blue.svg)](http://pizza.com)


# node-api-server

## Usage

`npm install node-api-server`


```
require('node-api-server')(({ server, config }, callback) => {
  callback()
})
```

Create a directory structure like this:

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
  - controllers.js
  - services.js
  - routes.js
  - policies.js
  - models.js
- app.js


This module will read all files in the api directories and read them into
modules for use. You can set them globally with config files in the config directory.    

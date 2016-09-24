/**
 * config/config.js
 *
 * Utils/Constructor for creating and setting up the config object
 */

const fs = require('fs')
const path = require('path')
const commander = require('commander')
const { defaultsDeep } = require('lodash')
const utils = require('./utils')

/**
 * Constructor for an app config object - Only creates a config object and returns
 * constructor() {object} Optional configs passed in on instantiation
 *  {
 *    configDir <String> optional // defaults to root/config
 *  }
 */
module.exports =
  class Config {
    constructor (_config) {
      // param passed into constructor during instantiation
      this._config = _config || ({})

      // command-line args
      this._args = getCommandLineArgs()

      this.connections = {}
      this.controllers = {}
      this.globals = {}
      this.logger = {}
      this.middleware = {}
      this.policies = {}
      this.routes = {}
      this.server = {}
      this.services = {}
      this.session = {}
      this.sockets = {}

      const definedConfigDir = path.join(global.__rootDir || path.parse(process.mainModule.filename).dir, '/config')

      const defaultConfigs = getDefaultConfigs()
      const definedConfigs = getDefinedConfigs(definedConfigDir)
      // merge configs - add default configs around definedConfigs
      const mergedConfigs = defaultsDeep(definedConfigs, defaultConfigs)

      Object.assign(this, mergedConfigs)

      return this
    }
}

/**
 * Get command line args (process.args)
 * @return {object} commander module return val
 */
const getCommandLineArgs = () => {
  // get command-line args
  try {
    commander
      .option('-p, --port [port]', 'Port Number')
      .option('-i, --interactive [interactive]', 'Start in interactive mode')
      .parse(process.argv)
  } catch (e) {
    console.log(new Error('commander cli failed'))
  }
  return commander
}

/**
 * Returns the default configs HashMap
 * @return {object}
 */
const getDefaultConfigs = () => {
  const defaultsDir = path.join(path.parse(module.filename).dir, '../config')
  return getDirConfigs(defaultsDir)
}

/**
 * Returns the defined configs in /config/ dir
 *
 * @NOTE keys are assigned by filename in /config/ dir
 *
 * @return {object}
 */
const getDefinedConfigs = (configDir) => {
  let _dir = utils.makePathFromRoot('config')
  if (configDir) {
    _dir = configDir
  }

  return getDirConfigs(_dir)
}

/**
 * Return a hashmap of config files in a given directory
 * @param  {string} dir
 * @return {object}
 */
const getDirConfigs = (dir) => {
  let configFiles

  try {
    configFiles = fs.readdirSync(dir)
  } catch (e) {
    console.log(new Error('config dir error getting config files at: ' + dir))
  }

  const hash = {}

  configFiles.forEach((f) => {
    if (!/\.js$/.test(f)) return

    const _fileName = f.replace('.js', '')
    const modulePath = path.join(dir, f)
    hash[_fileName] = require(modulePath)
  })

  return hash
}

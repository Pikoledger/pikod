const Logger = require('./logger')

module.exports = class Monitor {
  constructor () { // TODO: modules & log level
    this.logger = new Logger()

    this.logger.log('Lumi is READY!')
  }
}
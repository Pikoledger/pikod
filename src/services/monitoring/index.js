const Logger = require('./logger')

module.exports = class Monitor {
  constructor (modules, logLevel) {
    this.logger = new Logger()

    for (const module of modules) {
      
    }
  }
}
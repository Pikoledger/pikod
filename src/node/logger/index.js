const chalk = require('chalk')

module.exports = class Logger {
  constructor (loggingLevel) {
    this.loggingLevel = loggingLevel // TODO: Filter
  }

  reportDebug (debug) {
    log(`${chalk.blue('DEBUG')} ${debug}`)
  }

  reportError (error) {
    log(`${chalk.red('ERROR')} ${error}`)
  }

  reportInfo (info) {
    log(`${chalk.magenta('LOG')} ${info}`)
  }
}

const log = (message) => {
  const currentDate = new Date()

  const readableData = currentDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).split(' ').join('-')
  const readableTime = currentDate.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, '$1')

  console.log(`${chalk.green(readableData)} ${chalk.yellow(readableTime)} ${message}`)
}

const styles = require('./styles')
const Formatter = require('./formatter')

module.exports = class Logger {
  constructor () {
    this.formatter = new Formatter()
  }

  log (message, prefix) { // IDEA: use stderr etc. by console.error too
    console.log(`${this.formatter.stylize(styles.green, this.formatter.getReadableDate())} ${this.formatter.stylize(styles.yellowLight, this.formatter.getReadableTime())} ${prefix ?? "LOG"} ${message}`)
  }

  warn (warning) {
    this.log(warning, this.formatter.stylize(styles.yellow, 'WARN'))
  }

  error (error) {
    this.log(error, this.formatter.stylize(styles.red, 'ERR'))
  }
}
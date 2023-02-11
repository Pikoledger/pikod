module.exports = class Error {
  constructor (errorReason) {
    this.errorReason = errorReason
  }

  toJSON () {
    return {
      "success": false,
      "error": this.errorReason
    }
  }
}
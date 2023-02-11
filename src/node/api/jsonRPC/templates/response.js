module.exports = class Response {
  constructor (returnedData) {
    this.returnedData = returnedData
  }

  toJSON () {
    return {
      "success": true,
      "result": this.returnedData
    }
  }
}
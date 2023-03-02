class Request {
  constructor (id, request, params) {
    this.id = id
    this.request = request
    this.params = params
  }
   
  static fromJSON (request) {
    return new this(request, request.request, request.params)
  }

  toJSON () {
    return {
      id: this.id,
      request: this.request,
      data: this.params
    }
  }
}

class Response {
  constructor (id, response, params) {
    this.id = id
    this.request = response
    this.params = params
  }
   
  static fromJSON (response) {
    return new this(response, response.response, response.params)
  }

  toJSON () {
    return {
      id: this.id,
      request: this.response,
      data: this.params
    }
  }
}
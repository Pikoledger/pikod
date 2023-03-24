const calls = require('./peer/calls')

const dgram = require('dgram')
const { EventEmitter } = require('events')

module.exports = class Socket extends EventEmitter {
  constructor (port) {
    super()

    this.socket = dgram.createSocket('udp4')
    this.socket.bind(port)

    this.nonces = new Map()
    this.waitingRequests = []

    this._registerListeners()
  }

  _registerListeners () {
    this.socket.on('message', (msg, rinfo) => {
      try {
        const returnedData = JSON.parse(msg.toString())

        if (typeof returnedData.method !== 'undefined') {
          const request = new calls.Request(returnedData.id, returnedData.request, returnedData.params)
          
          this.emit('request', request)
        } else if (typeof returnedData.result !== 'undefined') {
          const response = new calls.Response(returnedData.id, returnedData.result, returnedData.params)
          
          this.waitingRequests
          this.emit('request', request)
        }
      } catch (err) {
        console.log(err)

        // TODO: Ban node
      }
      console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`)
    })
    
    this.socket.on('listening', () => {
      const address = this.socket.address()
      console.log(`server listening ${address.address}:${address.port}`)
    })
  }

  request (peer, request) {
    return new Promise(resolve, reject => {

    })
  }
}
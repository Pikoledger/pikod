const calls = require('./calls')

const dgram = require('dgram')
const { EventEmitter } = require('events')

module.exports = class Socket extends EventEmitter {
  constructor (port) {
    super()

    this.socket = dgram.createSocket('udp4')

    this.socket.bind(port)

    this._registerListeners()
  }

  _registerListeners () {
    this.socket.on('message', (msg, rinfo) => {
      try {
        const returnedData = JSON.parse(msg.toString())

        if (typeof returnedData.method !== 'undefined') {
          const request = new
          this.emit('request', r)
        } else if (typeof returnedData.result !== 'undefined') {

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
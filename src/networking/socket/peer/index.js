module.exports = class Peer {
  constructor (publicKey, ipAddress, port) {
    this.publicKey = publicKey
    this.ipAddress = ipAddress
    this.port = port
    this.nonce = 0
  }

  generateNonce () {
    this.nonce += 1
    
    return this.nonce
  }
}
const crypto = require('crypto')
const tweetnacl = require('tweetnacl-blake2b')

module.exports = class Block {
  constructor (type, contents) {
    this.type = type
    this.hash = block.hash
    this.confirmed = false

    this.sender = block.sender
    this.fee = block.fee
  
    if (this.type === 'send') {
      this.recipient = block.recipient
      this.amount = block.amount
      this.data = block.data ?? null
    }

    if (this.type === 'receive') {
      this.block = block.block
    }

    this.chainedBlock = block.chainedBlock
    this.signature = block.signature
  }

  calculateHash () {
    if (this.type === "send") {
      return crypto.createHash('ripemd160').update(this.type + this.sender + this.recipient + this.amount + this.chainedBlock).digest('hex')
    } else if (this.type === "receive") {
      return crypto.createHash('ripemd160').update(this.type + this.sender + this.block + this.chainedBlock).digest('hex')
    }
  }

  checkValidity () {
    if (!(this.type === 'send' || this.type === 'receive')) return false
    if (this.calculateHash() !== this.hash) return false

    const message = tweetnacl.sign.open(Uint8Array.from(Buffer.from(this.signature)), Uint8Array.from(Array.from(this.sender)))
    return(this.hash === Buffer.from(message).toString('hex'))
  }
}
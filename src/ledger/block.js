const crypto = require('crypto')
const tweetnacl = require('tweetnacl-blake2b')

module.exports = class Block {
  constructor (block) {
    this.type = block.type
    this.hash = block.hash
    this.sender = block.sender

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
    this.confirmed = false
  }

  calculateHash () {
    if (this.type === "send") {
      return crypto.createHash('ripemd160').update(this.type + this.sender + this.recipient + this.amount + this.chainedBlock).digest('hex')
    } else if (this.type === "receive") {
      return crypto.createHash('ripemd160').update(this.type + this.sender + this.block + this.chainedBlock).digest('hex')
    }
  }

  async checkValidity () {
    if (!(this.type === 'send' || this.type === 'receive')) return false
    if (this.calculateHash() !== this.hash) return false

    return tweetnacl.sign.detached.verify(Uint8Array.from(Buffer.from(this.hash, 'hex')), Uint8Array.from(Buffer.from(this.signature, 'hex')), Uint8Array.from(Buffer.from(this.sender, 'hex')))
  }

  toJSON () {
    return {
      type: this.type,
      hash: this.hash,
      sender: this.sender,
      recipient: this?.recipient,
      amount: this?.amount,
      data: this?.data,
      block: this?.block,
      chainedBlock: this.chainedBlock,
      signature: this.signature,
      confirmed: this.confirmed
    }
  }
}
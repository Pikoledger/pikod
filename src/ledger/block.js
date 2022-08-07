module.exports = class Block {
  constructor (type, operation) { 
    this.type = type

    if (this.type === 'send') {
      this.sender = this.operation.sender
      this.recipient = this.operation.recipient
      this.amount = this.operation.recipient
    } else if (this.type === 'receive') {
      this.sender = this.operation.sender
      this.recipient = this.operation.recipient
      this.amount = this.operation.recipient
    } else if (this.type === 'consensus') {

    }
  }
} 
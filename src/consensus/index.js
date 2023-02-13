const events = require('events')

const genesisState = require('../genesis')

module.exports = class Consensus extends events.EventEmitter {
  constructor (ledger) {
    super()

    this.ledger = ledger

    this.nodeAccount = undefined
    this.validators = new Set()

    if (this.ledger.getBlockCount() === "0") {
      this.ledger.statesDB.put(genesisState.recipient, genesisState.toJSON())
    }
  }

  async discoverBlock (block) {
    if (await block.checkValidity() === false) return
    if (await this.ledger.isBlockValid(block) === false) return

    block.confirmed = true

    await this.ledger.addBlock(block)
  }
  
  declareSelf (account) {
    this.nodeAccount = account
  }
}
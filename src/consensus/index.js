const events = require('events')

const genesisBlock = require('../genesis')

module.exports = class Consensus extends events.EventEmitter {
  constructor (ledger) {
    super()

    this.ledger = ledger

    this.nodeAccount = undefined
    this.validators = new Set()

    if (this.ledger.getBlockCount() === "0") {
      this.ledger.blocksDB.put(genesisBlock.hash, genesisBlock).then(() => {
        this.ledger.accountsDB.put(genesisBlock.sender, [ genesisBlock.hash ])
      })
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
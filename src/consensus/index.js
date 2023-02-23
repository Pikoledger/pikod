const events = require('events')

const genesisState = require('../genesis')

module.exports = class Consensus extends events.EventEmitter {
  constructor (ledger) {
    super()

    this.ledger = ledger

    this.nodeAccount = undefined
    this.validators = new Set()

    this.activeElections = {}

    if (this.ledger.getBlockCount() === "0") {
      this.ledger.statesDB.put(genesisState.recipient, genesisState.toJSON())
    }
  }

  declareSelf (account) {
    this.nodeAccount = account
  }

  async discoverBlock (block) {
    if (await block.checkValidity() === false) return
    if (await this.ledger.isBlockValid(block) === false) return

    await this.ledger.addBlock(block)

    if (this.getPower(this.nodeAccount) > BigInt(0)) {
      this.emit('vote', block.hash)
    }
  }

  async submitVoting (vote) {
    if (typeof this.activeElections?.[vote.hash] === 'undefined') {
      this.activeElections[vote.hash] = BigInt(0)
    }

    this.activeElections[vote.hash] += await this.getPower(vote.voter)

    if (await this.getNetworkPower() / 2 <= this.activeElections[vote.hash]) {
      await this.ledger.updateConfirmation(vote.hash)
    }
  }

  async getMinerWeight () { // possible optimizations like do a constant and update it only when mine block
    return BigInt("1") // wen dynamic
  }

  async getMinerScore (address) {
    return (await this.ledger.getState(address)).minerScore
  }
}
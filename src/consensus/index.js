const genesisState = require('../genesis')

const { EventEmitter } = require('events')

module.exports = class Consensus extends EventEmitter {
  constructor (ledger, storage) {
    super()

    this.ledger = ledger
    this.storage = storage

    this.nodeAccount = undefined
    this.activeElections = {} // TODO: Store it on storage instead of cache

    this.registerLedger()
  }

  declareSelf (account) {
    this.nodeAccount = account
  }

  registerLedger () {
    if (this.ledger.getBlockCount() === '0') {
      this.ledger.statesDB.putSync(genesisState.recipient, genesisState.toJSON())
    }

    this.ledger.on('scoreMintage', async (amount) => {
      await this.storage.put('scoreWeight', (await this.getScoreWeight()) + amount)
    })
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

    this.activeElections[vote.hash] += await this.getScore(vote.voter)

    if (await this.getScoreWeight() / 2 <= this.activeElections[vote.hash]) {
      await this.ledger.updateConfirmation(vote.hash)
    }
  }

  async getScoreWeight () {
    return BigInt(this.storage.get('scoreWeight') ?? 0)
  }

  async getScore (address) {
    return (await this.ledger.getState(address)).minerScore
  }
}

const { EventEmitter } = require('events')
const genesisState = require('./genesis')

module.exports = class Consensus extends EventEmitter {
  constructor (ledger, storage) {
    super()

    this.ledger = ledger
    this.storage = storage

    this.nodeAccount = undefined
    this.activeElections = {} // TODO: Maybe store it on storage

    this.registerLedger()
  }

  declareSelf (account) {
    this.nodeAccount = account
  }

  async registerLedger () {
    if (await this.ledger.getBlockCount() === '0') {
      await this.ledger.statesDB.put(genesisState.recipient, genesisState.toJSON())
    }

    this.ledger.on('scoreMintage', async (amount) => { // TODO: Rename stateChange
      await this.storage.put('scoreWeight', (await this.getScoreWeight()) + amount)
    })
  }

  async discoverBlock (block) {
    if (await block.checkValidity() === false) return
    if (await this.ledger.isBlockValid(block) === false) return

    await this.ledger.addBlock(block)

    if (await this.getScore(this.nodeAccount) > BigInt(0)) {
      this.emit('vote', block.hash)
    }
  }

  async submitVoting (vote) {
    if (typeof this.activeElections?.[vote.hash] === 'undefined') {
      this.activeElections[vote.hash] = BigInt(0)
    }

    this.activeElections[vote.hash] += await this.getScore(vote.voter)

    if (this.activeElections[vote.hash] >= await this.getScoreWeight() / 2n) {
      await this.ledger.confirmBlock(vote.hash)
      
      this.emit('confirmation', vote.hash)
    }
  }

  async getScoreWeight () {
    return BigInt(await this.storage.get('scoreWeight') ?? 0)
  }

  async getScore (address) {
    return (await this.ledger.getState(address)).minerScore
  }
}

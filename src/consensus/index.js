const events = require('events')

const genesisState = require('../genesis')

module.exports = class Consensus extends events.EventEmitter {
  constructor (blockDAG, storage) {
    super()

    this.blockDAG = blockDAG
    this.storage = storage

    this.nodeAccount = undefined
    this.activeElections = {} // TODO: Store it on storage instead of cache

    this.registerLedger()
  }

  declareSelf (account) {
    this.nodeAccount = account
  }

  registerLedger () {
    if (this.blockDAG.getBlockCount() === '0') {
      this.blockDAG.statesDB.putSync(genesisState.recipient, genesisState.toJSON())
    }

    this.blockDAG.on('blockConfirmation', async (block) => {
      if (block.type === 'mine') {
        await this.storage.put('scoreWeight', (await this.getScoreWeight()) + BigInt("1"))
      }
    })
  }

  async discoverBlock (block) {
    if (await block.checkValidity() === false) return
    if (await this.blockDAG.isBlockValid(block) === false) return

    await this.blockDAG.addBlock(block)

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
      await this.blockDAG.updateConfirmation(vote.hash)
    }
  }

  async getScoreWeight () {
    return BigInt(this.storage.get('scoreWeight') ?? 0)
  }

  async getScore (address) {
    return (await this.blockDAG.getState(address)).minerScore
  }
}

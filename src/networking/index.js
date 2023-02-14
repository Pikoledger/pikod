const Vote = require('./vote')

module.exports = class Network {
  constructor(consensus) {
    this.consensus = consensus

    this.consensus.on('vote', async (block) => {
      await this.consensus.submitVoting(new Vote({
        voter: this.consensus.nodeAccount,
        hash: block
      }))
    })
  }
  
  joinNetwork (wallet) {
    this.consensus.declareSelf(wallet.address)
  }

  async announceBlock (block) {
    await this.consensus.discoverBlock(block)
  }
}
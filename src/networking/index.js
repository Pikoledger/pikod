module.exports = class Network {
  constructor(consensus) {
    this.consensus = consensus

    this.consensus.on('vote', async (vote) => {
      await this.consensus.submitVoting(vote)
    })
  }
  
  joinNetwork (wallet) {
    this.consensus.declareSelf(wallet.address)
  }

  async announceBlock (block) {
    await this.consensus.discoverBlock(block)
  }
}
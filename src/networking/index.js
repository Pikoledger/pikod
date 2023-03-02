const Socket = require('./src/socket')
const Vote = require('./vote')

const { EventEmitter } = require('events')

module.exports = class Networking extends EventEmitter {
  constructor (port, consensus) {
    super()
    
    this.consensus = consensus

    this.socket = new Socket(port)
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

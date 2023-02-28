const Vote = require('./vote')

const dgram = require('dgram')
const { EventEmitter } = require('events')

module.exports = class Networking extends EventEmitter {
  constructor (port, consensus) {
    super()
    
    this.consensus = consensus
    this.socket = dgram.createSocket('udp4');

    this.consensus.on('vote', async (block) => {
      await this.consensus.submitVoting(new Vote({
        voter: this.consensus.nodeAccount,
        hash: block
      }))
    })

    this.socket.bind(port)
  }

  joinNetwork (wallet) {
    this.consensus.declareSelf(wallet.address)
  }

  async announceBlock (block) {
    await this.consensus.discoverBlock(block)
  }
}

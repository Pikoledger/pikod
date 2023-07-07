const { EventEmitter } = require('events')
const Storage = require('./storage')
const BlockDAG = require('../ledger/blockDAG')
const Consensus = require('../consensus')
const Network = require('../networking')
const Wallet = require('./wallet')

module.exports = class Node extends EventEmitter {
  constructor (config) {
    super()

    this.config = config
    this.storage = new Storage(config.node.ledgerPath)
    this.ledger = new BlockDAG({ 
      accounts: this.storage.openDB('accounts'),
      states: this.storage.openDB('states'),
      indexes: this.storage.openDB('indexes'),
      blocks: this.storage.openDB('blocks')
    })
    this.consensus = new Consensus(this.ledger, this.storage.openDB('consensus'))
    this.networking = new Network(this.config.node.peeringPort, this.consensus)
    this.wallet = Wallet.fromPath(this.config.node.walletPath)
    this.networking.joinNetwork(this.wallet)

    this.emit('ready')
  }
}
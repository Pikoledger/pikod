const Storage = require('./storage')
const BlockDAG = require('../ledger/blockDAG')
const Consensus = require('../consensus')
const Network = require('../networking')
const Wallet = require('./wallet')
const Monitor = require('./monitoring')

module.exports = class Node {
  constructor (config) {
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
    this.networking.joinNetwork(wallet)
  }
}

const config = require('./config.json')
const storage = new Storage('./storage/ledger.db')

const ledger = new BlockDAG({ 
  accounts: storage.openDB('accounts'),
  states: storage.openDB('states'),
  indexes: storage.openDB('indexes'),
  blocks: storage.openDB('blocks')
})
const consensus = new Consensus(ledger, storage.openDB('consensus'))
const networking = new Network(config.node.peeringPort, consensus)

const wallet = Wallet.fromPath('./storage/wallet.json')
networking.joinNetwork(wallet)

const jsonRPC = new (require('./src/node/api/jsonRPC'))(config.node.rpcPort, { ledger, consensus, networking })
const monitor = new Monitor()

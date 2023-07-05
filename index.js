const Storage = require('./src/node/storage')
const BlockDAG = require('./src/ledger/blockDAG')
const Consensus = require('./src/consensus')
const Network = require('./src/networking')
const Wallet = require('./src/node/wallet')
const Monitor = require('./src/node/monitoring')

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

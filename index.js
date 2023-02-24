const Storage = require('./src/node/storage')
const BlockDAG = require('./src/ledger/blockDAG')
const Consensus = require('./src/consensus')
const Network = require('./src/networking')
const Wallet = require('./src/node/wallet')

const config = require('./config.json')
const storage = new Storage('./storage/ledger.db')

const ledger = new BlockDAG({ accounts: storage.openHeader('accounts'), states: storage.openHeader('states'), indexes: storage.openHeader('indexes'), blocks: storage.openHeader('blocks') })
const consensus = new Consensus(ledger, storage.openHeader('consensus'))
const networking = new Network(consensus)

const wallet = Wallet.fromPath('./storage/wallet.json')
networking.joinNetwork(wallet)

const jsonRPC = new (require('./src/node/api/jsonRPC'))(ledger, networking, config.node.rpcPort)

console.log('Piko node ready!')

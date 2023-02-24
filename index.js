const Database = require('./src/node/storage')
const BlockDAG = require('./src/ledger/blockDAG')
const Consensus = require('./src/consensus')
const Network = require('./src/networking')
const Wallet = require('./src/node/wallet')

const config = require('./config.json')
const database = new Database('./ledger/ledger.ldb')

const ledger = new BlockDAG({
  accounts: database.openHeader('accounts'),
  states: database.openHeader('states'),
  indexes: database.openHeader('indexes'),
  blocks: database.openHeader('blocks')
})
const consensus = new Consensus(ledger, database.openHeader('network'))
const networking = new Network(consensus)

const wallet = Wallet.fromPath('./ledger/wallet.json')
networking.joinNetwork(wallet)

const jsonRPC = new (require('./src/node/api/jsonRPC'))(ledger, networking, config.node.rpcPort)

console.log('Piko node ready!')

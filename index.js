const Database = require('./src/node/database')
const BlockDAG = require('./src/ledger/blockDAG')
const Consensus = require('./src/consensus')
const Network = require('./src/networking')
const Wallet = require('./src/node/wallet')

const config = require('./config.json')
const database = new Database('./ledger/ledger.ldb')

const ledger = new BlockDAG({
  accountsDB: database.openHeader("accounts"),
  statesDB: database.openHeader("states"),
  indexesDB: database.openHeader("indexes"),
  blocksDB: database.openHeader("blocks")
})
const consensus = new Consensus(ledger)
const networking = new Network(consensus)

const wallet = Wallet.fromPath('./ledger/wallet.json')
networking.joinNetwork(wallet)

const jsonRPC = new (require('./src/node/api/jsonRPC'))(ledger, networking, config.node.rpcPort)

console.log('Piko node ready!')
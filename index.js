const BlockDAG = require('./src/ledger/blockDAG')
const Consensus = require('./src/consensus')
const Network = require('./src/networking')
const Wallet = require('./src/node/wallet')
const Logger = require('./src/node/logger')

const config = require('./config.json')
const logger = new Logger()

const ledger = new BlockDAG('./ledger')
logger.reportInfo(`Connection with ledger established.`)
const consensus = new Consensus(ledger)
logger.reportInfo(`Consensus is listening for agreements.`)
const networking = new Network(consensus)
logger.reportInfo(`Networking is welcoming the world.`)

const wallet = config.wallet.privateKey === "" ? Wallet.createOne() : new Wallet(config.wallet.privateKey)
networking.joinNetwork(wallet)
logger.reportInfo(`Now everyone knows us as ${wallet.address}.`)

const jsonRPC = new (require('./src/node/api/jsonRPC'))(ledger, networking, config.node.rpcPort)
logger.reportInfo(`Everyone can reach to me using ${config.node.rpcPort} port.`)

logger.reportInfo('Piko node ready!')
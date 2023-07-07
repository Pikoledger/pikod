const Node = require('./src/node')
const RPC = require('./src/services/api/jsonRPC')
const Monitor = require('./src/services/monitoring')

const config = require('./config.json')

const node = new Node(config)
const jsonRPC = new RPC(config.node.rpcPort, { ledger: node.ledger, consensus: node.consensus, networking: node.networking })
const monitor = new Monitor()

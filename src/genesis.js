
const State = require('./ledger/state')

const genesisState = new State({
  balance: BigInt('3600000') * BigInt(1e8),
  minerScore: BigInt('1')
})

genesisState.recipient = '03435f2e5f69861416f462accd9046477818d44b493299c4db92bc5150447b72'

module.exports = genesisState

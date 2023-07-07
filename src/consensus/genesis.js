const State = require('../ledger/state')

const genesisState = new State({
  balance: BigInt('3600000') * BigInt(1e8),
  minerScore: BigInt('1')
})

genesisState.recipient = 'a44cc8ef3c0cf356fb5150649375be56071bb8592f5b2264b006baa3641acacb'

module.exports = genesisState

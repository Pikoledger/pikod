const Block = require('./ledger/block')

const genesisBlock = new Block({
  type: 'receive',
  sender: '03435f2e5f69861416f462accd9046477818d44b493299c4db92bc5150447b72',
  fee: "0",
  block: null,
})

genesisBlock.hash = genesisBlock.calculateHash()
genesisBlock.state = {
  balance: (BigInt('100000000') * BigInt(1e8)).toString(),
}
genesisBlock.confirmed = true

module.exports = genesisBlock
const Block = require('../../../../ledger/block')

module.exports = {
  execute: async (args, { networking }) => {
    if (typeof args?.[0] === 'undefined') throw Error('Missing args, expecting a block')
    if (args[0].confirmed) throw Error('Cant accept illegal block')

    const block = new Block(args[0])
    await networking.announceBlock(block)

    return block.calculateHash()
  }
}

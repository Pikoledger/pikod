module.exports = {
  execute: async (args, { ledger }) => {
    if (typeof args?.[0] === 'undefined') throw Error('Missing args, expecting a block hash')

    return (await ledger.getBlock(args[0]))?.toJSON() ?? null
  }
}
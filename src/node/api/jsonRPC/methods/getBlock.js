module.exports = {
  execute: async (args, { ledger }) => {
    if (typeof args?.[0] === 'undefined') throw Error('Missing args, excepting a block hash')

    return ((await ledger.getBlock(args[0])).toJSON())
  }
}
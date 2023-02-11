module.exports = {
  execute: async (args, { ledger }) => {
    if (typeof args?.[0] === 'undefined') throw Error('Missing args, expecting an address')
    
    return (await ledger.getBalance(args[0])).toString()
  }
}
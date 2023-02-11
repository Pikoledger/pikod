module.exports = {
  execute: async (args, { ledger }) => {
    if (typeof args?.[0] === 'undefined') throw Error('Missing args, excepting an address')
    
    return (await ledger.getBalance(args[0])).toString()
  }
}
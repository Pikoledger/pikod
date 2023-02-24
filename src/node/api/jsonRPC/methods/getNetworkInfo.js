module.exports = {
  execute: async (args, { ledger }) => {
    return {
      networkName: 'Experimental', // TODO: Dynamic network name by genesis?
      blockCount: ledger.getBlockCount()
    }
  }
}

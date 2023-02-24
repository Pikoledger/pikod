module.exports = {
  execute: async (args, { consensus, ledger }) => {
    return {
      networkName: 'Experimental', // TODO: Dynamic network name by genesis?
      blockCount: ledger.getBlockCount()
    }
  }
}

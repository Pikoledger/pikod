module.exports = {
  execute: async (args, { consensus, ledger }) => {
    return {
      networkName: 'Experimental', // TODO: Dynamic network name by genesis?
      blockCount: await ledger.getBlockCount(),
      scoreWeight: await consensus.getScoreWeight()
    }
  }
}

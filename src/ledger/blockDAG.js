
module.exports = class BlockDAG {
  constructor () {
    this.blocksDB = {}
    this.accountsDB = {}
  }

  checkIntegrity (block) {
    const chain = this.db[block.sender]

    if (block.chainedBlock !== chain?.[(chain?.length ?? 0) - 1] ?? null) return false

    if (block.type === 'receive') {
      if (typeof this.blocksDB?.[block.block] === 'undefined') return false
    }

    return true
  }

  addBlock (block) {
    if (typeof this.db[block.sender] === 'undefined') this.db[block.sender] = []

    this.db[block.hash].push(block)
  }
}
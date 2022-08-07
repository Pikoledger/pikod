module.exports = class BlockDAG {
  constructor () {
    this.db = {}
  }

  checkIntegrity (block) {
    if (block.type === 'send') {
      
    } else if (block.type === 'receive') {

    } else if (block.type === 'consensus') {

    }
  }

  addBlock (block) {
    if (typeof this.db[block.sender] === 'undefined') this.db[block.sender] = []

    this.db[block.hash].push(block)
  }
}
const Block = require('./block')
const State = require('./state')

module.exports = class BlockDAG {
  constructor(database) {
    this.accountsDB = database.accountsDB
    this.statesDB = database.statesDB
    this.indexesDB = database.indexesDB
    this.blocksDB = database.blocksDB
  }

  async isBlockValid (block) {
    const blocks = await this.getBlocks(block.sender)

    if (block.chainedBlock === null) {
      if (blocks.length !== 0) return false
    } else {
      if (blocks[blocks.length - 1] !== block.chainedBlock) return false
    }
    
    if (block.type === 'send') {
      const state = await this.getState(block.sender)

      if (state.balance < BigInt(block.amount)) return false
    } else if (block.type === 'receive') {
      const receivedBlock = await this.getBlock(block.block) // An useless check bcs already checked technically by index but why not
      if (receivedBlock === undefined) return false

      const index = await this.getIndexing(block.sender)
      if (!index.includes(block.block)) return false
    }
  }

  async addBlock (block) { // TODO: Find a way to make all operations in exact time or dont.
    const blocks = await this.getBlocks(block.sender)
    const state = await this.getState(block.sender)

    if (block.type === 'send') {
      state.balance -= BigInt(block.amount)

      const index = await this.getIndexing(block.recipient)
      index.push(block.hash)

      await this.indexesDB.put(block.recipient, index)
    } else if (block.type === 'receive') {
      const receivedBlock = await this.getBlock(block.block)

      state.balance += BigInt(receivedBlock.amount)

      let index = await this.getIndexing(block.sender)
      index = index.filter(hash => hash !== block.hash)
      
      await this.indexesDB.put(block.sender, index)
    } else if (block.type === 'mine') {
      const earnedPoints = BigInt('1') // TODO: Based on diff(Like a share)
    
      state.minerScore += earnedPoints
    }

    blocks.push(block.hash)

    await this.accountsDB.put(block.sender, blocks)
    await this.blocksDB.put(block.hash, block.toJSON())
    await this.statesDB.put(block.sender, state.toJSON())
  }

  async confirmBlock (hash) {
    const block = await this.getBlock(hash)

    block.confirmed = true

    await this.blocksDB.put(block.hash, block.toJSON())
  }

  async getBlockCount () {
    return this.blocksDB.getStats().entryCount.toString()
  }

  async getBlock (hash) {
    const fetchedBlock = this.blocksDB.get(hash)

    return typeof fetchedBlock !== 'undefined' ? new Block(fetchedBlock) : undefined
  }

  async getIndexing (account) {
    return this.indexesDB.get(account) ?? []
  }

  async getState (account) {
    return new State(this.statesDB.get(account))
  }

  async getBlocks (account) {
    const blocks = this.accountsDB.get(account) ?? []

    return blocks 
  }
}
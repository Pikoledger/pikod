const Block = require('./block')
const State = require('./state')

const { EventEmitter } = require('events')

module.exports = class BlockDAG extends EventEmitter {
  constructor (storage) {
    super()
    
    this.accountsDB = storage['accounts']
    this.statesDB = storage['states']
    this.indexesDB = storage['indexes']
    this.blocksDB = storage['blocks']
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

    if (block.type === 'send') {
      const state = await this.getState(block.sender)

      state.balance -= BigInt(block.amount)

      await this.statesDB.put(block.sender, state.toJSON())
    } else if (block.type === 'receive') {
      let index = await this.getIndexing(block.sender)

      index = index.filter(hash => hash !== block.hash)

      await this.indexesDB.put(block.sender, index)
    }

    blocks.push(block.hash)

    await this.accountsDB.put(block.sender, blocks)
    await this.blocksDB.put(block.hash, block.toJSON())
  }

  async confirmBlock (hash) {
    const block = await this.getBlock(hash)
    const state = await this.getState(block.sender)

    if (block.type === 'send') {
      const index = await this.getIndexing(block.recipient)

      index.push(block.hash)

      await this.indexesDB.put(block.recipient, index)
    } else if (block.type === 'receive') {
      const receivedBlock = await this.getBlock(block.block)

      state.balance += BigInt(receivedBlock.amount)
    } else if (block.type === 'mine') {
      const earnedPoints = BigInt('1') // TODO: Based on diff(Like a share)

      state.minerScore += earnedPoints

      this.emit('scoreMintage', earnedPoints)
    }

    block.confirmed = true

    await this.blocksDB.put(block.hash, block.toJSON())
    await this.statesDB.put(block.sender, state.toJSON())
  }

  async getBlockCount () {
    return await this.blocksDB.getLength()
  }

  async getBlock (hash) {
    const fetchedBlock = await this.blocksDB.get(hash)

    return typeof fetchedBlock !== 'undefined' ? new Block(fetchedBlock) : undefined
  }

  async getIndexing (account) {
    return await this.indexesDB.get(account) ?? []
  }

  async getState (account) {
    return new State(await this.statesDB.get(account))
  }

  async getBlocks (account) {
    const blocks = await this.accountsDB.get(account) ?? []

    return blocks
  }
}

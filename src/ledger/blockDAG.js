const lmdb = require('lmdb')

const Block = require('./block')
const State = require('./state')

module.exports = class BlockDAG {
  constructor(dir) {
    this.db = lmdb.open({
      path: `${dir}/ledger.ldb`
    })

    this.accountsDB = this.db.openDB("accounts")
    this.statesDB = this.db.openDB("states")
    this.indexesDB = this.db.openDB("indexes")
    this.blocksDB = this.db.openDB("blocks")
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
    }

    blocks.push(block.hash)

    await this.accountsDB.put(block.sender, blocks)
    await this.blocksDB.put(block.hash, block.toJSON())
    await this.statesDB.put(block.sender, state.toJSON())
  }

  async updateConfirmation (blockHash) {
    const block = await this.getBlock(blockHash)

    block.confirmed = true

    await this.blocksDB.put(block.hash, block.toJSON())
  }

  getBlockCount () {
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
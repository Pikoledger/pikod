const lmdb = require('lmdb')

const Block = require('./block')

module.exports = class BlockDAG {
  constructor(dir) {
    this.db = lmdb.open({
      path: `${dir}/ledger.ldb`
    })

    this.accountsDB = this.db.openDB("accounts")
    this.blocksDB = this.db.openDB("blocks")
  }

  async isBlockValid (block) {
    const accountCache = await this.getBlocks(block.sender)

    if (typeof accountCache[accountCache.length - 1] === 'undefined') {
      if (typeof block.chainedBlock !== undefined) return false
    } else { 
      if (accountCache[accountCache.length - 1] !== block.chainedBlock) return false
    }

    if (block.type === 'send') {
      if (BigInt(block.amount) > BigInt(await this.getBalance(block.sender))) return false
    } else if (block.type === 'receive') {
      const receivingBlock = await this.getBlock(block.block)

      if (receivingBlock.type !== 'send' || receivingBlock.recipient !== block.sender) return false
    } else return false

    return true
  }

  async addBlock (block) {
    const accountCache = await this.getBlocks(block.sender)
    const prevBalance = BigInt((await this.blocksDB.get(accountCache?.[accountCache.length - 1]))?.state.balance) ?? BigInt('0')

    if (block.type === 'send') {
      block.state = { balance: prevBalance - BigInt(block.amount) }
    } else if (block.type === 'receive') {
      const receivedBlock = await this.getBlock(block.block)

      block.state = { balance: prevBalance + BigInt(receivedBlock.amount) }
    }

    accountCache.push(block.hash)

    await this.accountsDB.put(block.sender, accountCache)
    await this.blocksDB.put(block.hash, block)
  }

  getBlockCount () {
    return this.blocksDB.getStats().entryCount.toString()
  }

  async getBlock (hash) {
    const fetchedBlock = this.blocksDB.get(hash)

    return typeof fetchedBlock !== 'undefined' ? new Block(fetchedBlock) : undefined
  }

  async getBalance (account) {
    const chain = this.accountsDB.get(account) ?? []

    if (chain.length === 0) return BigInt(0)
    return this.blocksDB.get(chain[chain.length - 1]).state.balance
  }

  async getBlocks (account) {
    const blocks = this.accountsDB.get(account) ?? []

    return blocks 
  }
}
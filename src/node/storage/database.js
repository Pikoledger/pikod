module.exports = class Database {
  constructor (sector) {
    this.sector = sector
  }
  
  async getLength () {
    return this.sector.getStats().entryCount.toString()
  }

  async put (identifier, key) {
    return await this.sector.put(identifier,  key)
  }

  async get (identifier) {
    return this.sector.get(identifier)
  }
}
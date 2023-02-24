const lmdb = require('lmdb')

module.exports = class Database {
  constructor (path) {
    this.db = lmdb.open({
      path
    })
  }

  openHeader (identifier) {
    return this.db.openDB(identifier)
  }
}

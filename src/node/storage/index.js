const lmdb = require('lmdb')

module.exports = class Database {
  constructor (path) {
    this.db = lmdb.open({
      path: path
    })
  }

  openDB (identifier) {
    return this.db.openDB(identifier)
  }
}

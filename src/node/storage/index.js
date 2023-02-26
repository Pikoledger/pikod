const lmdb = require('lmdb')

const Database = require('./database')

module.exports = class Storage {
  constructor (path) {
    this.db = lmdb.open({
      path: path
    })
  }

  openDB (identifier) {
    return new Database(this.db.openDB(identifier))
  }
}

const fs = require('fs')

const Wallet = require('./src/wallet')

module.exports = class Manager {
  static fromPath (path) {
    try {
      const wallet = fs.readFileSync(path, { encoding: 'utf-8' })

      return new Wallet(JSON.parse(wallet).privateKey)
    } catch (err) {
      const newWallet = Wallet.createOne()

      fs.writeFileSync(path, JSON.stringify(newWallet.toJSON()), { encoding: 'utf-8' })

      return newWallet
    }
  }
}

module.exports = class State {
  constructor (state) {
    this.balance = state?.balance ?? BigInt('0')
  }

  toJSON () {
    return {
      balance: this.balance
    }
  }
}
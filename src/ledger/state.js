module.exports = class State {
  constructor (state) {
    this.balance = BigInt(state?.balance ?? 0)
    this.minerScore = BigInt(state?.minerScore ?? 0)
  }

  toJSON () {
    return {
      balance: this.balance.toString(),
      minerScore: this.minerScore.toString()
    }
  }
}

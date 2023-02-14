module.exports = class Vote {
  constructor (vote) {
    this.voter = vote.voter
    this.hash = vote.hash
  }
}
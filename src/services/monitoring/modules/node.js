module.exports = class Module {
  constructor (logger, node) {
    this.logger = logger
    this.node = node

    this.#registerListeners()
  }

  #registerListeners () {
    this.node.on('ready', this.logger.log('Node is ready!'))
  }
}
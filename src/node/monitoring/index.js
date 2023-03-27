module.exports = class Monitor {
  constructor (modules, level) {
    modules.forEach(module => {
      
    })
    this.level = level
  }

  static supportedModules () {
    return [ "consensus" ]
  }
}
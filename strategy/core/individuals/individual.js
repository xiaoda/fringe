class Individual {
  constructor (options = {}) {
    this.type = options.type
    this.food = 0
  }

  clone () {
    const constructor = this.__proto__.constructor
    return new constructor()
  }
}

export default Individual

class Currency {
  constructor (options = {}) {
    this.name = options.name
    this.interest = options.interest || 0
  }
}

export default Currency

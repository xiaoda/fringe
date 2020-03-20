class City {
  constructor (options = {}) {
    this.name = options.name
    this.airports = options.airports || [] // Name
    this.population = options.population
  }
}

export default City

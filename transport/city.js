class City {
  constructor (options = {}) {
    this.name = options.name || ''
    this.airports = options.airports || [/* Airport name */]
    this.population = options.population || 0
    this.travelRatio = options.travelRatio || 0
    this.travelPopulation = this.population * this.travelRatio
    this.dests = options.dests || {/* City: Portion */}
    this.destsSum = (
      Object.keys(this.dests).length ?
      Object.keys(this.dests)
        .map(city => this.dests[city])
        .reduce((acc, current) => acc + current) :
      0
    )
  }

  getTravelPopulation (city) {
    if (!this._travelPopulation) this._travelPopulation = {}
    if (!this._travelPopulation.hasOwnProperty(city.name)) {
      const travelPopulation = (
        _getOneWayPopulation(this, city) +
        _getOneWayPopulation(city, this)
      )
      this._travelPopulation[city.name] = travelPopulation
    }

    function _getOneWayPopulation (depart, dest) {
      const destPortion = (
        depart.dests.hasOwnProperty(dest.name) ?
        depart.dests[dest.name] :
        0
      )
      const destsPortion = depart.destsSum || 1
      return (
        depart.population * depart.travelRatio *
        destPortion / destsPortion
      )
    }

    return this._travelPopulation[city.name]
  }

  getCurrentTravelPopulation (city) {
    if (!this._currentTravelPopulation) {
      this._currentTravelPopulation = {}
    }
  }
}

export default City

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
    this.travelPopulationRiseRate = 1
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
    const [passedTime] = window.getPassedTime()
    const travelPopulation = this.getTravelPopulation(city)
    let currentTravelPopulation
    if (this._currentTravelPopulation.hasOwnProperty(city.name)) {
      const [
        lastPassedTime, lastTravelPopulation
      ] = this._currentTravelPopulation[city.name]
      currentTravelPopulation = (
        lastTravelPopulation +
        travelPopulation * (passedTime - lastPassedTime) * this.travelPopulationRiseRate
      )
    } else {
      currentTravelPopulation = (
        travelPopulation * passedTime * this.travelPopulationRiseRate
      )
    }
    currentTravelPopulation = GeometryUtils.clamp(
      0, travelPopulation, currentTravelPopulation
    )
    this._currentTravelPopulation[city.name] = [
      passedTime, currentTravelPopulation
    ]
    return currentTravelPopulation
  }

  changeCurrentTravelPopulation (city, variation) {
    const [passedTime] = window.getPassedTime()
    const travelPopulation = this.getTravelPopulation(city)
    const currentTravelPopulation = this.getCurrentTravelPopulation(city)
    const newCurrentTravelPopulation = GeometryUtils.clamp(
      0, travelPopulation, currentTravelPopulation + variation
    )
    const actualVariation = newCurrentTravelPopulation - currentTravelPopulation
    this._currentTravelPopulation[city.name] = [
      passedTime, newCurrentTravelPopulation
    ]
    return actualVariation
  }
}

export default City

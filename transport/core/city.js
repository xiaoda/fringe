import BaseClass from './base.js'

/* Constants */
const TRAVEL_POPULATION_RIZE_RATE = .000000000005

class City extends BaseClass {
  constructor (options = {}) {
    super()
    this.name = options.name || ''
    this.airports = options.airports || [/* Airport Name */]
    this.population = options.population || 0
    this.travelRatio = options.travelRatio || 0
    this.travelPopulation = this.population * this.travelRatio
    this.dests = options.dests || {/* City: Proportion */}
    this.destsSum = (
      Object.keys(this.dests).length ?
      Object.keys(this.dests)
        .map(city => this.dests[city])
        .reduce((acc, current) => acc + current) :
      0
    )
    this.travelPopulationRiseRate = TRAVEL_POPULATION_RIZE_RATE
  }

  getTravelPopulation (city) {
    if (!this._travelPopulation) this._travelPopulation = {}
    if (!this._travelPopulation.hasOwnProperty(city.name)) {
      this._travelPopulation[city.name] = (
        _getOneWayPopulation(this, city) +
        _getOneWayPopulation(city, this)
      )
    }
    function _getOneWayPopulation (depart, dest) {
      const destProportion = (
        depart.dests.hasOwnProperty(dest.name) ?
        depart.dests[dest.name] :
        0
      )
      const destsProportion = depart.destsSum || 1
      return Math.floor(
        depart.population * depart.travelRatio *
        destProportion / destsProportion
      )
    }
    return this._travelPopulation[city.name]
  }

  getCurrentTravelPopulation (city) {
    if (!this._currentTravelPopulation) {
      this._currentTravelPopulation = {}
    }
    const [passedTime] = window.clock.getPassedTime()
    const travelPopulation = this.getTravelPopulation(city)
    let currentTravelPopulation
    if (this._currentTravelPopulation.hasOwnProperty(city.name)) {
      const [
        lastPassedTime, lastTravelPopulation
      ] = this._currentTravelPopulation[city.name]
      currentTravelPopulation = (
        lastTravelPopulation +
        Math.floor(
          travelPopulation *
          (passedTime - lastPassedTime) * this.travelPopulationRiseRate
        )
      )
    } else {
      currentTravelPopulation = Math.floor(
        travelPopulation *
        passedTime * this.travelPopulationRiseRate
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

  changeCurrentTravelPopulation (city, variation = 0) {
    variation = Math.floor(variation)
    const [passedTime] = window.clock.getPassedTime()
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

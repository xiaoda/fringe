import BaseClass from './base.js'

class Airport extends BaseClass {
  constructor (options = {}) {
    super()
    this.name = options.name || ''
    this.city = options.city /* City Instance */
  }

  transportToAirport (airport, passengers) {
    const actualPassengers = this.city.changeCurrentTravelPopulation(
      airport.city, passengers * -1
    ) * -1
    return actualPassengers
  }
}

export default Airport

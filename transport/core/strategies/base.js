import BaseClass from '../base.js'

class StrategyBaseClass extends BaseClass {
  constructor (options = {}) {
    super()
    this.name = options.name || ''
    this.cities = options.cities || [/* Cities Instance */]
    this.airports = this.cities.map(city => {
      const [airportName] = city.airports
      return window.airports[airportName]
    })
    this.minPassengers = options.minPassengers || 0
    this.optionFactory('airplane', null /* Airplane Instance */)
    this.optionFactory('departAirport', null /* Airport Instance */)
    this.optionFactory('destAirport', null /* Airport Instance */)
    this.optionFactory('timerCallbackIndex', null)
  }

  linkAirplane (airplane) {
    const departAirport = airplane.airport()
    this.airplane(airplane)
    this.departAirport(departAirport)
    if (typeof this.afterLinkAirplane === 'function') {
      this.afterLinkAirplane()
    }
    this.startTimer()
  }

  unlinkAirplane () {
    this.stopTimer()
    this.airplane(null)
    this.departAirport(null)
    this.destAirport(null)
    if (typeof this.afterUnlinkAirplane === 'function') {
      this.afterUnlinkAirplane()
    }
  }

  startTimer () {
    const timerCallbackIndex = window.clock.registerCyclicCallback(
      'minute', timeText => {
        const airplane = this.airplane()
        const [readyToCreateFlight] = airplane.readyToCreateFlight()
        if (!readyToCreateFlight) return
        if (typeof this.loop === 'function') {
          this.loop(timeText)
        }
      }
    )
    this.timerCallbackIndex(timerCallbackIndex)
  }

  stopTimer () {
    const timerCallbackIndex = this.timerCallbackIndex()
    window.clock.unregisterCyclicCallback(timerCallbackIndex)
  }

  createFlight (options = {}) {
    const airplane = this.airplane()
    const departAirport = this.departAirport()
    const departCity = departAirport.city
    const {destAirport} = options
    const destCity = destAirport.city
    const travelPopulation = (
      departCity.getCurrentTravelPopulation(destCity)
    )
    if (travelPopulation < this.minPassengers) return
    airplane.createFlight({destAirport})
    this.departAirport(destAirport)
  }
}

export default StrategyBaseClass

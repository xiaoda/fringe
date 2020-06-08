import BaseClass from '../base.js'

class RoundTripStrategy extends BaseClass {
  constructor (options = {}) {
    super()
    this.name = 'Round Trip'
    this.airports = options.airports || [/* Airport Instance */]
    this.passengers = options.passengers || 0
    this.optionFactory('airplane', null /* Airplane Instance */)
    this.optionFactory('departAirport', null /* Airport Instance */)
    this.optionFactory('destAirport', null /* Airport Instance */)
    this.optionFactory('timerCallbackIndex', null)
  }

  linkAirplane (airplane) {
    const departAirport = airplane.airport()
    const [destAirport] = this.airports.filter(airport => {
      return airport.name !== departAirport.name
    })
    this.airplane(airplane)
    this.departAirport(departAirport)
    this.destAirport(destAirport)
    this.startTimer()
  }

  unlinkAirplane () {
    this.stopTimer()
    this.airplane(null)
    this.departAirport(null)
    this.destAirport(null)
  }

  startTimer () {
    const timerCallbackIndex = window.clock.registerCyclicCallback(
      'minute', timeText => {
        const airplane = this.airplane()
        if (airplane.flight()) return
        const departAirport = this.departAirport()
        const departCity = departAirport.city
        const destAirport = this.destAirport()
        const destCity = destAirport.city
        const currentTravelPopulation = (
          departCity.getCurrentTravelPopulation(destCity)
        )
        const passengers = (
          this.passengers === 'seats' ?
          airplane.seats :
          this.passengers
        )
        if (currentTravelPopulation < passengers) return
        airplane.createFlight({
          departAirport, destAirport
        })
        this.departAirport(destAirport)
        this.destAirport(departAirport)
      }
    )
    this.timerCallbackIndex(timerCallbackIndex)
  }

  stopTimer () {
    const timerCallbackIndex = this.timerCallbackIndex()
    window.clock.unregisterCyclicCallback(timerCallbackIndex)
  }
}

export default RoundTripStrategy

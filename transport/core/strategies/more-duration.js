import StrategyBaseClass from './base.js'
import Flight from '../flight.js'

class MoreDurationStrategy extends StrategyBaseClass {
  constructor (options = {}) {
    super({
      ...options,
      name: 'More Duration'
    })
  }

  loop (timeText) {
    const departAirport = this.departAirport()
    const departCity = departAirport.city
    const airports = this.airports
      .filter(airport => airport.name !== departAirport.name)
    let tempDuration = 0
    let tempDestAirport
    airports.forEach(destAirport => {
      const destCity = destAirport.city
      const duration = Flight.getFlightDuration(
        departCity, destCity
      )
      if (duration > tempDuration) {
        tempDuration = duration
        tempDestAirport = destAirport
      }
    })
    if (!tempDestAirport) return
    const destAirport = tempDestAirport
    this.createFlight({destAirport})
  }
}

export default MoreDurationStrategy

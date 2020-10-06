import StrategyBaseClass from './base.js'
import Flight from '../flight.js'

class MoreDurationPerSeatStrategy extends StrategyBaseClass {
  constructor (options = {}) {
    super({
      ...options,
      name: 'More Duration / Seat'
    })
  }

  loop (timeText) {
    const departAirport = this.departAirport()
    const departCity = departAirport.city
    const airports = this.airports
      .filter(airport => airport.name !== departAirport.name)
    let tempDurationAboutSeat = 0
    let tempDestAirport
    airports.forEach(destAirport => {
      const destCity = destAirport.city
      const travelPopulation = (
        departCity.getCurrentTravelPopulation(destCity)
      )
      if (travelPopulation < this.minPassengers) return
      const duration = Flight.getFlightDuration(
        departCity, destCity
      )
      const durationAboutSeat = duration * travelPopulation
      if (durationAboutSeat > tempDurationAboutSeat) {
        tempDurationAboutSeat = durationAboutSeat
        tempDestAirport = destAirport
      }
    })
    if (!tempDestAirport) return
    const destAirport = tempDestAirport
    this.createFlight({destAirport})
  }
}

export default MoreDurationPerSeatStrategy

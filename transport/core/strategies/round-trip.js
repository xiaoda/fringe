import StrategyBaseClass from './base.js'

class RoundTripStrategy extends StrategyBaseClass {
  constructor (options = {}) {
    super({
      ...options,
      name: 'Round Trip'
    })
  }

  loop (timeText) {
    const departAirport = this.departAirport()
    const [destAirport] = this.airports.filter(airport => {
      return airport.name !== departAirport.name
    })
    this.createFlight({destAirport})
  }
}

export default RoundTripStrategy

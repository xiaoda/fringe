import StrategyBaseClass from './base.js'

class MorePassengersStrategy extends StrategyBaseClass {
  constructor (options = {}) {
    super({
      ...options,
      name: 'More Passengers'
    })
  }

  loop (timeText) {
    const departAirport = this.departAirport()
    const departCity = departAirport.city
    const airports = this.airports
      .filter(airport => airport.name !== departAirport.name)
    let tempTravelPopulation = 0
    let tempDestAirport
    airports.forEach(destAirport => {
      const destCity = destAirport.city
      const travelPopulation = (
        departCity.getCurrentTravelPopulation(destCity)
      )
      if (travelPopulation > tempTravelPopulation) {
        tempTravelPopulation = travelPopulation
        tempDestAirport = destAirport
      }
    })
    if (!tempDestAirport) return
    const destAirport = tempDestAirport
    this.createFlight({destAirport})
  }
}

export default MorePassengersStrategy

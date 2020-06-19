import StrategyBaseClass from './base.js'

class MorePassengersStrategy extends StrategyBaseClass {
  constructor (options = {}) {
    super({
      ...options,
      name: 'More Passengers'
    })
  }

  loop (timeText) {
    const airplane = this.airplane()
    const [readyToCreateFlight] = airplane.readyToCreateFlight()
    if (!readyToCreateFlight) return
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
    const travelPopulation = tempTravelPopulation
    const destAirport = tempDestAirport
    const passengers = (
      this.passengers === 'seats' ?
      airplane.seats :
      this.passengers
    )
    if (travelPopulation < passengers) return
    airplane.createFlight({
      departAirport, destAirport
    })
    this.departAirport(destAirport)
  }
}

export default MorePassengersStrategy

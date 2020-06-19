import StrategyBaseClass from './base.js'

class RoundTripStrategy extends StrategyBaseClass {
  constructor (options = {}) {
    super({
      ...options,
      name: 'Round Trip'
    })
  }

  afterLinkAirplane () {
    const airplane = this.airplane()
    const departAirport = airplane.airport()
    const [destAirport] = this.airports.filter(airport => {
      return airport.name !== departAirport.name
    })
    this.destAirport(destAirport)
  }

  loop (timeText) {
    const airplane = this.airplane()
    const [readyToCreateFlight] = airplane.readyToCreateFlight()
    if (!readyToCreateFlight) return
    const departAirport = this.departAirport()
    const destAirport = this.destAirport()
    const departCity = departAirport.city
    const destCity = destAirport.city
    const travelPopulation = (
      departCity.getCurrentTravelPopulation(destCity)
    )
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
    this.destAirport(departAirport)
  }
}

export default RoundTripStrategy

import BaseClass from './base.js'

class FlightLogs extends BaseClass {
  constructor (options = {}) {
    super()
    this.logs = []
  }

  addLog (flight) {
    const log = {
      company:         flight.airplane.company,
      airplane:        flight.airplane.name,
      departAirport:   flight.departAirport.name,
      departCity:      flight.departCity.name,
      destAirport:     flight.destAirport.name,
      destCity:        flight.destCity.name,
      seats:           flight.airplane.seats,
      passengers:      flight.passengers(),
      takeoffTimeText: flight.getTakeoffTimeText(),
      arriveTimeText:  flight.getArriveTimeText()
    }
    this.logs.push(log)
  }
}

export default FlightLogs

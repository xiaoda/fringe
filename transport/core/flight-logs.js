import BaseClass from './base.js'

class FlightLogs extends BaseClass {
  constructor (options = {}) {
    super()
    this.logs = []
  }

  addLog (flight) {
    const log = {
      company:          flight.airplane.company,
      airplane:         flight.airplane.name,
      departAirport:    flight.departAirport.name,
      departCity:       flight.departCity.name,
      departCityAbbr:   flight.departCity.abbr,
      destAirport:      flight.destAirport.name,
      destCity:         flight.destCity.name,
      destCityAbbr:     flight.destCity.abbr,
      seats:            flight.airplane.seats,
      passengers:       flight.passengers(),
      takeoffTimeText:  flight.getTakeoffTimeText(),
      arriveTimeText:   flight.getArriveTimeText(),
      durationTimeText: flight.getDurationTimeText(),
      durationPerSeat:  flight.getDurationPerSeat()
    }
    this.logs.push(log)
    this.broadcastNewLog(log)
  }

  clearLogs () {
    this.logs = []
  }

  broadcastNewLog (log) {
    if (!window.channel) return
    window.channel.postMessage({
      action: 'newFlightLog',
      data: log
    })
  }
}

export default FlightLogs

import BaseClass from './base.js'

class AirplaneOverview extends BaseClass {
  constructor (options = {}) {
    super()
    this.airplane = options.airplane /* Airplane Instance */
    this.optionFactory('cities', [/* Cities Abbr */])
    this.optionFactory('flights', 0)
    this.optionFactory('passengers', 0)
  }

  addFlightData (flight) {
    console.log(flight)
    // todo
  }

  getAttendance () {}

  getDurationTimeText () {}

  getDurationPerSeat () {}
}

export default AirplaneOverview

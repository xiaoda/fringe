import BaseClass from './base.js'

class AirplaneOverview extends BaseClass {
  constructor (options = {}) {
    super()
    this.optionFactory('cities', [])
    this.optionFactory('flights', 0)
    this.optionFactory('passengers', 0)
  }

  getAttendance () {}

  getDurationTimeText () {}

  getDurationPerSeat () {}
}

export default AirplaneOverview

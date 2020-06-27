import BaseClass from './base.js'
import Clock from './clock.js'
import flightsDuration from '../data/flights-duration.js'

class Flight extends BaseClass {
  constructor (options = {}) {
    super()
    this.airplane = options.airplane /* Airplane Instance */
    this.departAirport = options.departAirport /* Airport Instance */
    this.departCity = this.departAirport.city /* City Instance */
    this.destAirport = options.destAirport /* Airport Instance */
    this.destCity = this.destAirport.city /* City Instance */
    this.onArrive = options.onArrive || (_ => {})
    this.optionFactory('status', 'initial')
    this.optionFactory('durationMilliseconds', 0)
    this.optionFactory('takeoffTimeStamp', 0)
    this.optionFactory('arrivalTimeStamp', 0)
    this.optionFactory('passengers', 0)
  }

  takeoff () {
    const [currentTimeStamp] = window.clock.getPassedTime()
    const durationMilliseconds = Flight.getFlightDuration(
      this.departCity, this.destCity
    )
    const arrivalTimeStamp = (
      currentTimeStamp + durationMilliseconds
    )
    const passengers = this.departAirport.transportToAirport(
      this.destAirport, this.airplane.seats
    )
    this.status('flying')
    this.durationMilliseconds(durationMilliseconds)
    this.takeoffTimeStamp(currentTimeStamp)
    this.arrivalTimeStamp(arrivalTimeStamp)
    this.passengers(passengers)
    this.addToFlightLogs()
    this.airplane.addToOverview(this)
    window.clock.registerSingleCallback(
      arrivalTimeStamp, _ => this.arrive()
    )
  }

  addToFlightLogs () {
    if (!window.flightLogs) return
    window.flightLogs.addLog(this)
  }

  arrive () {
    this.status('arrived')
    this.onArrive()
  }

  getTakeoffTimeText () {
    const takeoffTimeStamp = this.takeoffTimeStamp()
    const takeoffTimeText = Clock.generateTimeText(takeoffTimeStamp)
    return takeoffTimeText
  }

  getArriveTimeText () {
    const arrivalTimeStamp = this.arrivalTimeStamp()
    const arriveTimeText = Clock.generateTimeText(arrivalTimeStamp)
    return arriveTimeText
  }

  getToArriveTimeText () {
    const [currentTimeStamp] = window.clock.getPassedTime()
    const arrivalTimeStamp = this.arrivalTimeStamp()
    let toArriveMilliseconds = arrivalTimeStamp - currentTimeStamp
    if (toArriveMilliseconds < 0) {
      toArriveMilliseconds = 0
    }
    const toArriveTimeText = Clock.shortenTimeText(
      Clock.generateTimeText(toArriveMilliseconds),
      'minute'
    )
    return toArriveTimeText
  }

  getDurationTimeText () {
    const durationMilliseconds = this.durationMilliseconds()
    const durationTimeText = Clock.shortenTimeText(
      Clock.generateTimeText(durationMilliseconds),
      'minute'
    )
    return durationTimeText
  }

  getDurationPerSeat () {
    const durationMilliseconds = this.durationMilliseconds()
    const seats = this.airplane.seats
    const passengers = this.passengers()
    const millsecondsPerSeat = (
      durationMilliseconds * (passengers / seats)
    )
    const timeTextPerSeat = Clock.shortenTimeText(
      Clock.generateTimeText(millsecondsPerSeat),
      'minute'
    )
    return timeTextPerSeat
  }

  static getFlightDuration (departCity, destCity) {
    const timeText = (
      (
        flightsDuration[departCity.abbr] &&
        flightsDuration[departCity.abbr][destCity.abbr]
      ) ||
      (
        flightsDuration[destCity.abbr] &&
        flightsDuration[destCity.abbr][departCity.abbr]
      )
    )
    if (!timeText) return null
    const milliseconds = Clock.generateMilliseconds(timeText)
    return milliseconds
  }
}

export default Flight

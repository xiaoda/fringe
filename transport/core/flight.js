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
    this.optionFactory('durationTimeText', 0)
    this.optionFactory('takeoffTimeStamp', 0)
    this.optionFactory('arrivalTimeStamp', 0)
    this.optionFactory('passengers', 0)
  }

  takeoff () {
    const [currentTimeStamp] = window.clock.getPassedTime()
    const [durationMilliseconds, durationTimeText] = (
      Flight.getFlightDuration(
        this.departCity, this.destCity
      )
    )
    const arrivalTimeStamp = (
      currentTimeStamp + durationMilliseconds
    )
    const passengers = this.departAirport.transportToAirport(
      this.destAirport, this.airplane.seats
    )
    this.status('flying')
    this.durationTimeText(durationTimeText)
    this.takeoffTimeStamp(currentTimeStamp)
    this.arrivalTimeStamp(arrivalTimeStamp)
    this.passengers(passengers)
    this.AddToFlightLogs()
    window.clock.registerSingleCallback(
      arrivalTimeStamp, _ => this.arrive()
    )
  }

  AddToFlightLogs () {
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

  static getFlightDuration (departCity, destCity) {
    const timeText = (
      (
        flightsDuration[departCity.name] &&
        flightsDuration[departCity.name][destCity.name]
      ) ||
      (
        flightsDuration[destCity.name] &&
        flightsDuration[destCity.name][departCity.name]
      )
    )
    if (!timeText) return null
    const milliseconds = Clock.generateMilliseconds(timeText)
    return [milliseconds, timeText]
  }
}

export default Flight

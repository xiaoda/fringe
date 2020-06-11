import BaseClass from './base.js'
import Clock from './clock.js'
import flightDuration from '../data/flight-duration.js'

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
    this.optionFactory('takeoffTimeStamp', 0)
    this.optionFactory('arrivalTimeStamp', 0)
    this.optionFactory('passengers', 0)
  }

  takeoff () {
    this.status('flying')
    const [currentTimeStamp] = window.clock.getPassedTime()
    const arrivalTimeStamp = (
      currentTimeStamp +
      Flight.getFlightDuration(
        this.departCity, this.destCity
      )
    )
    const passengers = this.departAirport.transportToAirport(
      this.destAirport, this.airplane.seats
    )
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
    const duration = (
      (
        flightDuration[departCity.name] &&
        flightDuration[departCity.name][destCity.name]
      ) ||
      (
        flightDuration[destCity.name] &&
        flightDuration[destCity.name][departCity.name]
      )
    )
    if (!duration) return null
    const milliseconds = Clock.generateMilliseconds(duration)
    return milliseconds
  }
}

export default Flight

import BaseClass from './base.js'
import Clock from './clock.js'
import flightDuration from '../data/flight-duration.js'

class Flight extends BaseClass {
  constructor (options = {}) {
    super()
    this.airplane = options.airplane /* Airplane Instance */
    this.departAirport = options.departAirport /* Airport Instance */
    this.destAirport = options.destAirport /* Airport Instance */
    this.departCity = this.departAirport.city /* City Instance */
    this.destCity = this.destAirport.city /* City Instance */
    this.optionFactory('takeoffTimeStamp', 0)
    this.optionFactory('arriveTimeStamp', 0)
    this.optionFactory('status', 'initial')
  }

  takeoff () {
    this.status('flying')
    const [currentTimeStamp] = window.clock.getPassedTime()
    const arriveTimeStamp = (
      currentTimeStamp +
      Flight.getFlightDuration(
        this.departCity, this.destCity
      )
    )
    this.takeoffTimeStamp(currentTimeStamp)
    this.arriveTimeStamp(arriveTimeStamp)
  }

  arrive () {
    this.status('arrived')
    this.airplane.flight(null)
  }

  getTakeoffTimeText () {
    const takeoffTimeStamp = this.takeoffTimeStamp()
    const takeoffTimeText = Clock.generateTimeText(takeoffTimeStamp)
    return takeoffTimeText
  }

  getArriveTimeText () {
    const arriveTimeStamp = this.arriveTimeStamp()
    const arriveTimeText = Clock.generateTimeText(arriveTimeStamp)
    return arriveTimeText
  }

  static getFlightDuration (departCity, destCity) {
    const duration = (
      flightDuration[departCity.name][destCity.name] ||
      flightDuration[destCity.name][departCity.name]
    )
    if (!duration) return null
    const milliseconds = Clock.generateMilliseconds(duration)
    return milliseconds
  }
}

export default Flight

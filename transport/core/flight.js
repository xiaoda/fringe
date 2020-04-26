import BaseClass from './base.js'

class Flight extends BaseClass {
  constructor (options = {}) {
    super()
    this.airplane = options.airplane /* Airplane Instance */
    this.departAirport = options.departAirport /* Airport Instance */
    this.destAirport = options.destAirport /* Airport Instance */
    this.takeoffTimeStamp = 0
    this.arriveTimeStamp = 0
    this.status = 'initial'
  }

  takeoff () {
    this.takeoffTimeStamp = new Date().getTime()
    this.status = 'inFlight'
  }

  arrive () {
    this.status = 'arrived'
  }
}

export default Flight

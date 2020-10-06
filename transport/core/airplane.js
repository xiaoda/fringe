import BaseClass from './base.js'
import Clock from './clock.js'
import Flight from './flight.js'
import AirplaneOverview from './airplane-overview.js'

/* Constants */
const AIRBUS_250 = 'airbus250'

class Airplane extends BaseClass {
  constructor (options = {}) {
    super()
    this.name = options.name || ''
    this.company = options.company || ''
    this.model = options.model || ''
    const modelData = Airplane.getModelData(this.model)
    this.seats = modelData.seats || 0
    this.prepareNextFligtTime = Clock.generateMilliseconds('6h')
    this.optionFactory(
      'airport',
      options.airport /* Airport Instance */
    )
    this.optionFactory('flight', null /* Flight Instance */)
    this.optionFactory('strategy', null /* Strategy Instance */)
    this.optionFactory('readyToFlyTimeStamp', 0)
    const overview = new AirplaneOverview({
      airplane: this
    })
    this.optionFactory('overview', overview)
  }

  readyToCreateFlight () {
    if (this.flight()) {
      return [false, `Airplane [${this.name}] already in a flight.`]
    }
    const [currentTimeStamp] = window.clock.getPassedTime()
    const readyToFlyTimeStamp = this.readyToFlyTimeStamp()
    if (currentTimeStamp < readyToFlyTimeStamp) {
      return [false, `Airplane [${this.name}] not ready`]
    }
    return [true]
  }

  createFlight (options = {}) {
    const [
      readyToCreateFlight, createFlightErrorMessage
    ] = this.readyToCreateFlight()
    if (!readyToCreateFlight) {
      return console.error(createFlightErrorMessage)
    }
    const departAirport = this.airport()
    const {destAirport} = options
    const flight = new Flight({
      airplane: this,
      departAirport,
      destAirport,
      onArrive: _ => {
        this.flight(null)
        this.airport(destAirport)
      }
    })
    this.flight(flight)
    flight.takeoff()
    const arrivalTimeStamp = flight.arrivalTimeStamp()
    const readyToFlyTimeStamp = (
      arrivalTimeStamp + this.prepareNextFligtTime
    )
    this.readyToFlyTimeStamp(readyToFlyTimeStamp)
  }

  applyStrategy (strategy) {
    this.suspendStrategy()
    strategy.linkAirplane(this)
    this.strategy(strategy)
  }

  suspendStrategy () {
    const strategy = this.strategy()
    if (!strategy) return
    strategy.unlinkAirplane()
    this.strategy(null)
  }

  addToOverview (flight) {
    const overview = this.overview()
    overview.addFlightData(flight)
  }

  static models () {
    return {
      AIRBUS_250
    }
  }

  static getModelData (model) {
    const modelsData = {
      [AIRBUS_250]: {
        seats: 250
      }
    }
    return modelsData[model]
  }
}

export default Airplane

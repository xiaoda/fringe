import BaseClass from './base.js'
import Clock from './clock.js'
import Flight from './flight.js'

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
    this.prepareNextFligtTime = Clock.generateMilliseconds('3h')
    this.optionFactory(
      'airport',
      options.airport /* Airport Instance */
    )
    this.optionFactory('flight', null /* Flight Instance */)
    this.optionFactory('strategy', null /* Strategy Instance */)
    this.optionFactory('readyToFlyTimeStamp', 0)
  }

  canCreateFlight (options = {}) {
    if (this.flight()) {
      return [false, `Airplane [${this.name}] already in a flight.`]
    }
    const [currentTimeStamp] = window.clock.getPassedTime()
    const readyToFlyTimeStamp = this.readyToFlyTimeStamp()
    if (currentTimeStamp < readyToFlyTimeStamp) {
      return [false, `Airplane [${this.name}] not ready`]
    }
    const {
      departAirport, destAirport
    } = options
    return [true]
  }

  createFlight (options = {}) {
    const {
      departAirport, destAirport
    } = options
    const [
      canCreateFlight, createFlightErrorMessage
    ] = this.canCreateFlight({
      departAirport, destAirport
    })
    if (!canCreateFlight) {
      return console.error(createFlightErrorMessage)
    }
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

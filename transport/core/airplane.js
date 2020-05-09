import BaseClass from './base.js'
import Flight from './flight.js'

/* Constants */
const AIRBUS_250 = 'airbus250'

class Airplane extends BaseClass {
  constructor (options = {}) {
    super()
    this.name = options.name || ''
    this.model = options.model || ''
    const modelData = Airplane.getModelData(this.model)
    this.seats = modelData.seats || 0
    this.optionFactory('flight', null /* Flight Instance */)
    this.optionFactory(
      'airport',
      options.airport /* Airport Instance */
    )
  }

  createFlight (options = {}) {
    const {
      departAirport, destAirport
    } = options
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

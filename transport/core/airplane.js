import BaseClass from './base.js'

/* Constants */
const AIRBUS_250 = 'airbus250'

class Airplane extends BaseClass {
  constructor (options = {}) {
    super()
    this.name = options.name || ''
    this.model = options.model || ''
    const modelData = Airplane.getModelData(this.model)
    this.seats = modelData.seats || 0
    this.optionFactory('flight', null)
    this.optionFactory(
      'airport',
      options.airport /* Airport Instance */
    )
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

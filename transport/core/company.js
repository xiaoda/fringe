import BaseClass from './base.js'

class Company extends BaseClass {
  constructor (options = {}) {
    super()
    this.name = options.name || ''
    this.airplanes = options.airplanes || [/* Airplane Instance */]
  }
}

export default Company

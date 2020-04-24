import BaseClass from './base.js'

class Airport extends BaseClass {
  constructor (options = {}) {
    super()
    this.name = options.name || ''
    this.city = options.city /* City Instance */
  }
}

export default Airport

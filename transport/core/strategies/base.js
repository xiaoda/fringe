import BaseClass from '../base.js'

class StrategyBaseClass extends BaseClass {
  constructor (options = {}) {
    super()
    this.name = options.name || ''
    this.airports = options.airports || [/* Airport Instance */]
    this.passengers = options.passengers || 0
    this.optionFactory('airplane', null /* Airplane Instance */)
    this.optionFactory('departAirport', null /* Airport Instance */)
    this.optionFactory('destAirport', null /* Airport Instance */)
    this.optionFactory('timerCallbackIndex', null)
  }

  linkAirplane (airplane) {
    const departAirport = airplane.airport()
    this.airplane(airplane)
    this.departAirport(departAirport)
    if (typeof this.afterLinkAirplane === 'function') {
      this.afterLinkAirplane()
    }
    this.startTimer()
  }

  unlinkAirplane () {
    this.stopTimer()
    this.airplane(null)
    this.departAirport(null)
    this.destAirport(null)
    if (typeof this.afterUnlinkAirplane === 'function') {
      this.afterUnlinkAirplane()
    }
  }

  startTimer () {
    const timerCallbackIndex = window.clock.registerCyclicCallback(
      'minute', timeText => {
        if (typeof this.loop === 'function') {
          this.loop(timeText)
        }
      }
    )
    this.timerCallbackIndex(timerCallbackIndex)
  }

  stopTimer () {
    const timerCallbackIndex = this.timerCallbackIndex()
    window.clock.unregisterCyclicCallback(timerCallbackIndex)
  }
}

export default StrategyBaseClass

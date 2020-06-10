import BaseClass from './base.js'
import Clock from './clock.js'

class Airport extends BaseClass {
  constructor (options = {}) {
    super()
    this.name = options.name || ''
    this.city = options.city /* City Instance */
    this.operatingHours = [6, 24]
  }

  transportToAirport (airport, passengers) {
    const actualPassengers = (
      this.city.changeCurrentTravelPopulation(
        airport.city, passengers * -1
      ) * -1
    )
    return actualPassengers
  }

  isInOperatingHours (timeStamp) {
    if (!timeStamp) {
      timeStamp = window.clock.getPassedTime()[0]
    }
    const timeText = Clock.generateTimeText(timeStamp)
    const matchHour = timeText.match(/\d+h/)
    const hour = (
      matchHour ?
      Number(matchHour[0].replace('h', '')) :
      0
    )
    const [openHour, closeHour] = this.operatingHours
    const result = hour >= openHour && hour < closeHour
    return result
  }
}

export default Airport

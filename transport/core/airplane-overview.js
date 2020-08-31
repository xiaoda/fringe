import BaseClass from './base.js'
import Clock from './clock.js'

class AirplaneOverview extends BaseClass {
  constructor (options = {}) {
    super()
    this.airplane = options.airplane /* Airplane Instance */
    this.optionFactory('cities', [/* Cities Abbr */])
    this.optionFactory('flights', 0)
    this.optionFactory('seats', 0)
    this.optionFactory('passengers', 0)
    this.optionFactory('durationMilliseconds', 0)
    this.optionFactory('durationMillisecondsPerSeat', 0)
  }

  addFlightData (flight) {
    const cities = this.cities()
    let flights = this.flights()
    let seats = this.seats()
    let passengers = this.passengers()
    let durationMilliseconds = this.durationMilliseconds()
    let durationMillisecondsPerSeat = this.durationMillisecondsPerSeat()

    const {
      departCity, destCity, airplane
    } = flight
    const {seats: flightSeats} = airplane
    const flightPassengers = flight.passengers()
    const flightDurationMilliseconds = flight.durationMilliseconds()

    Array(
      departCity.abbr, destCity.abbr
    ).forEach(city => {
      if (cities.includes(city)) return
      cities.push(city)
    })
    flights++
    seats += flightSeats
    passengers += flightPassengers
    durationMilliseconds += flightDurationMilliseconds
    durationMillisecondsPerSeat += (
      flightDurationMilliseconds * flightPassengers / flightSeats
    )

    this.cities(cities)
    this.flights(flights)
    this.seats(seats)
    this.passengers(passengers)
    this.durationMilliseconds(durationMilliseconds)
    this.durationMillisecondsPerSeat(durationMillisecondsPerSeat)
  }

  getAttendance () {
    const passengers = this.passengers()
    const seats = this.seats()
    const attendance = (
      passengers ?
      passengers / seats :
      0
    )
    return attendance
  }

  getAttendanceText () {
    const attendance = this.getAttendance()
    const flights = this.flights()
    let attendanceText = (
      flights ?
      `${Math.round(attendance * 1000) / 10}%` :
      ''
    )
    return attendanceText
  }

  getDurationTimeText () {
    const durationMilliseconds = this.durationMilliseconds()
    const durationTimeText = Clock.shortenTimeText(
      Clock.generateTimeText(durationMilliseconds),
      'minute'
    )
    return durationTimeText
  }

  getDurationTimeTextPerSeat () {
    const durationMillisecondsPerSeat = this.durationMillisecondsPerSeat()
    const durationTimeText = Clock.shortenTimeText(
      Clock.generateTimeText(durationMillisecondsPerSeat),
      'minute'
    )
    return durationTimeText
  }
}

export default AirplaneOverview

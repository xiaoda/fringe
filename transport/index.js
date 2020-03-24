import Clock from './clock.js'
import City from './city.js'
import Airport from './airport.js'
import Company from './company.js'

/* Clock */
const clock = new Clock({
  rate: 50000
})

/* Cities */
const Shanghai = new City({
  name: 'Shanghai',
  airports: ['PVG'],
  population: 24240000, // until 2018
  travelRatio: .01,
  dests: {
    Hongkong: 1
  }
})
const Hongkong = new City({
  name: 'Hongkong',
  airports: ['HKG'],
  population: 7480000, // until 2018
  travelRatio: .01,
  dests: {
    Shanghai: 1
  }
})
const cities = {
  [Shanghai.name]: Shanghai,
  [Hongkong.name]: Hongkong
}

/* Airports */
const PVG = new Airport({
  name: 'PVG',
  city: Shanghai
})
const HKG = new Airport({
  name: 'HKG',
  city: Hongkong
})
const airports = {
  [PVG.name]: PVG,
  [HKG.name]: HKG
}

/* Companies */
const xiaoda = new Company({
  name: 'xiaoda'
})
const companies = {
  [xiaoda.name]: xiaoda
}

/* GO! */
clock.start()

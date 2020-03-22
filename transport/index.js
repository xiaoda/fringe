import City from './city.js'
import Airport from './airport.js'
import Company from './company.js'

/* Cities */
const Shanghai = new City({
  name: 'Shanghai',
  airports: ['PVG'],
  population: 24240000 // 2018
})
const Hongkong = new City({
  name: 'Hongkong',
  airports: ['HKG'],
  population: 7480000 // 2018
})

/* Airports */
const airports = {}
airports.PVG = new Airport({
  name: 'PVG',
  city: Shanghai
})
airports.HKG = new Airport({
  name: 'HKG',
  city: Hongkong
})

/* Companies */
const xiaoda = new Company({
  name: 'xiaoda'
})

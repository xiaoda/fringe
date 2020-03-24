import City from './city.js'
import Airport from './airport.js'
import Company from './company.js'

/* Cities */
const Shanghai = new City({
  name: 'Shanghai',
  airports: ['PVG'],
  population: 24240000, // 2018
  travelRatio: .01,
  dests: {
    Hongkong: 1
  }
})
const Hongkong = new City({
  name: 'Hongkong',
  airports: ['HKG'],
  population: 7480000, // 2018
  travelRatio: .01,
  dests: {
    Shanghai: 1
  }
})
const cities = {
  Shanghai, Hongkong
}

console.log('Shanghai', Shanghai.getTravelPopulation(Hongkong))
console.log('Hongkong', Hongkong.getTravelPopulation(Shanghai))

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
  PVG, HKG
}

/* Companies */
const xiaoda = new Company({
  name: 'xiaoda'
})
const companies = {
  xiaoda
}

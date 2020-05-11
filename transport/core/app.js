import Clock from './clock.js'
import City from './city.js'
import Airport from './airport.js'
import Airplane from './airplane.js'
import Company from './company.js'

/* Clock */
window.clock = new Clock()

/* Cities */
const Shanghai = new City({
  name: 'Shanghai',
  airports: ['PVG'],
  population: 24240000, // until 2018
  travelRatio: .05,
  dests: {
    Hongkong: 1
  }
})
const Hongkong = new City({
  name: 'Hongkong',
  airports: ['HKG'],
  population: 7480000, // until 2018
  travelRatio: .1,
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

/* Airplanes */
const {AIRBUS_250} = Airplane.models()
const airbusNo1 = new Airplane({
  name: 'AirbusNo1',
  model: AIRBUS_250,
  airport: PVG
})

/* Companies */
const xiaoda = new Company({
  name: 'xiaoda',
  airplanes: {
    [airbusNo1.name]: airbusNo1
  }
})
const companies = {
  [xiaoda.name]: xiaoda
}

/* Page */
function initData () {
  for (let companyName in companies) {
    const company = companies[companyName]
    const airplanes = company.airplanes
    for (let airplaneName in airplanes) {
      const airplane = airplanes[airplaneName]
      airplane.flight(null)
    }
  }
}
window.initApp = _ => {
  initData()
  $clockComponent.setData({
    ...$clockComponent.initialData,
    rate: clock.rate
  })
  $clockComponent.init()
  $citiesComponent.setData({
    ...$citiesComponent.initialData,
    cities
  })
  $companiesComponent.setData({
    ...$companiesComponent.initialData,
    companies,
    airports
  })
}
window.initApp()

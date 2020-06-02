import Clock from './clock.js'
import City from './city.js'
import Airport from './airport.js'
import Airplane from './airplane.js'
import FlightLogs from './flight-logs.js'
import Company from './company.js'
import strategies from './strategies/index.js'

/* Clock */
const clock = window.clock = new Clock()

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
  company: 'xiaoda',
  model: AIRBUS_250,
  airport: PVG
})

/* Flight Logs */
const flightLogs =
window.flightLogs = new FlightLogs()

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

/* Communicate */
const channel =
window.channel = new BroadcastChannel('transport')
function postFlightLogs () {
  channel.postMessage({
    action: 'flightLogs',
    data: flightLogs.logs
  })
}
channel.onmessage = e => {
  const {
    action, data
  } = e.data
  switch (action) {
    case 'requestFlightLogs':
      postFlightLogs()
      break
  }
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
  flightLogs.clearLogs()
}
const initApp =
window.initApp = _ => {
  initData()
  postFlightLogs()
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
    airports,
    strategies
  })
  $companiesComponent.init()
}

/* Go! */
initApp()

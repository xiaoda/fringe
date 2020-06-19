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
const Beijing = new City({
  name: 'Beijing',
  abbr: 'BJ',
  airports: ['PEK'],
  population: 21540000, // until 2018
  travelRatio: .05,
  dests: {
    Shanghai: 1,
    Hongkong: 1
  }
})
const Shanghai = new City({
  name: 'Shanghai',
  abbr: 'SH',
  airports: ['PVG'],
  population: 24240000, // until 2018
  travelRatio: .05,
  dests: {
    Beijing: 1,
    Hongkong: 1
  }
})
const Hongkong = new City({
  name: 'Hongkong',
  abbr: 'HK',
  airports: ['HKG'],
  population: 7480000, // until 2018
  travelRatio: .1,
  dests: {
    Beijing: .5,
    Shanghai: .5
  }
})
const cities = {
  [Beijing.name]: Beijing,
  [Shanghai.name]: Shanghai,
  [Hongkong.name]: Hongkong
}

/* Airports */
const PEK = new Airport({
  name: 'PEK',
  city: Beijing
})
const PVG = new Airport({
  name: 'PVG',
  city: Shanghai
})
const HKG = new Airport({
  name: 'HKG',
  city: Hongkong
})
const airports = {
  [PEK.name]: PEK,
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

/* Strategies */
const {
  RoundTripStrategy,
  MorePassengersStrategy
} = strategies
airbusNo1.applyStrategy(
  new MorePassengersStrategy({
    airports: Object.values(airports),
    passengers: airbusNo1.seats / 2
  })
)
/*
airbusNo1.applyStrategy(
  new RoundTripStrategy({
    airports: [PVG, HKG],
    passengers: airbusNo1.seats / 2
  })
)
*/

/* Flight Logs */
const flightLogs =
window.flightLogs = new FlightLogs()

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
  $strategiesComponent.setData({
    ...$strategiesComponent.initialData,
    companies,
  })
  $airplanesComponent.setData({
    ...$airplanesComponent.initialData,
    companies
  })
}

/* Go! */
initApp()

import Currency from './currency.js'
import House from './house.js'
import Investor from './investor.js'

const CNY = new Currency({
  name: 'CNY',
  interest: .05
})
const USD = new Currency({
  name: 'USD',
  interest: .05
})
const house = new House({
  currencies: [CNY, USD],
  rates: {
    USD: {
      CNY: 7
    }
  }
})
const xiaoda = new Investor()

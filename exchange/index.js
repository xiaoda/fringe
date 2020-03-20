import Currency from './currency.js'
import House from './house.js'
import Investor from './investor.js'

/* Currencies */
const CNY = new Currency({
  name: 'CNY',
  interest: .05
})
const USD = new Currency({
  name: 'USD',
  interest: .05
})

/* Exchange house */
const house = new House({
  currencies: [CNY, USD],
  rates: {
    USD: {
      CNY: 7
    }
  }
})

/* Investors */
const xiaoda = new Investor({
  name: 'xiaoda'
})

import Currency from './currency.js'
import Exchange from './exchange.js'
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

/* Exchange */
const exchange = new Exchange({
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

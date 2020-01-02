import Currency from './currency.js'

class House {
  constructor (options = {}) {
    this.currencies = options.currencies || []
    this.rates = this.generateRates(options.rates)
    this.chargeRatio = .01
  }

  generateRates (rawRates) {
    const rates = {}
    Object.keys(rawRates).forEach(currencyA => {
      if (!rates[currencyA]) rates[currencyA] = {}
      Object.keys(rawRates[currencyA]).forEach(currencyB => {
        if (!rates[currencyB]) rates[currencyB] = {}
        const rate = rawRates[currencyA][currencyB]
        rates[currencyA][currencyB] = rate
        rates[currencyB][currencyA] = 1 / rate
      })
    })
    return rates
  }

  changeRate (currencyA, currencyB, rate) {
    this.rates[currencyA][currencyB] = rate
    this.rates[currencyB][currencyA] = 1 / rate
  }

  exchange () {}
}

export default House

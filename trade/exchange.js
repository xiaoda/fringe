class Exchange {
  constructor (options = {}) {
    this.currencies = {} // Map, Instance
    options.currencies.forEach(currency => {
      this.currencies[currency.name] = currency
    })
    this.rates = this.generateRates(options.rates) // Map
    this.chargeRatio = options.chargeRatio || .01
  }

  generateRates (rawRates) {
    const rates = {}
    Object.keys(rawRates).forEach(currencyA => {
      if (!rates[currencyA]) rates[currencyA] = {}
      Object.keys(rawRates[currencyA]).forEach(currencyB => {
        if (!rates[currencyB]) rates[currencyB] = {}
        const rate = rawRates[currencyA][currencyB]
        try {
          _setRate(currencyA, currencyB, rate)
          _setRate(currencyB, currencyA, 1 / rate)
        } catch (e) {
          console.error(e)
        }
      })
    })

    function _setRate (one, another, rate) {
      if (
        rates[one][another] &&
        rates[one][another] !== rate
      ) {
        throw `Conflicted currency rate [${one}, ${another}]`
      }
      rates[one][another] = rate
    }

    return rates
  }

  getRate (currencyA, currencyB) {
    return this.rates[currencyA][currencyB]
  }

  setRate (currencyA, currencyB, rate) {
    this.rates[currencyA][currencyB] = rate
    this.rates[currencyB][currencyA] = 1 / rate
  }
}

export default Exchange

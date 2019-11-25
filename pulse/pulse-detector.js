class PulseDetector {
  constructor () {
    this.records = []
    this.rate = 0
    this.calculateInterval = 1
    this.calculate()
  }

  calculate () {
    setTimeout(_ => {
      const currentTimestamp = +new Date() / 1000
      for (let i = this.records.length - 1; i >= 0; i--) {
        const timestamp = this.records[i]
        if (currentTimestamp - timestamp > 60) {
          this.records.splice(i, 1)
        }
      }
      this.rate = Math.round(
        this.records.length / (currentTimestamp - this.records[0]) * 60
      )
      this.calculate()
    }, this.calculateInterval * 1000)
  }

  detect () {
    const timestamp = +new Date() / 1000
    this.records.push(timestamp)
  }

  getRate () {
    return this.rate
  }
}

export default PulseDetector

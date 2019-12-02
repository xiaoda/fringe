class Pulse {
  constructor (options = {}) {
    this.rate = options.rate || 80
    this.changingRateIntervalID = null
    this.callback = null
    this.pulsing()
  }

  changeRate (target, duration) {
    this.stopChangingRate()
    this.changingRateIntervalID = GeometryUtils.linearChange(
      this.rate, target, duration * 1000,
      current => this.rate = current
    )
  }

  stopChangingRate () {
    clearInterval(this.changingRateIntervalID)
  }

  pulsing () {
    const interval = 60 / this.rate
    GeometryUtils.setTimeoutCustom(_ => {
      this.pulsing()
      if (this.callback) this.callback()
    }, interval * 1000)
  }

  onPulse (callback) {
    this.callback = callback
  }

  getRate () {
    return Math.round(this.rate)
  }
}

export default Pulse

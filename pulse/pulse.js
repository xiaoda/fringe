class Pulse {
  constructor (options = {}) {
    this.rate = options.rate || 80
    this.changingRateIntervalID = null
    this.callback = null
    this.pulsing()
  }

  changeRate (target, duration) { // TODO: Linear rate when changing
    this.stopChangingRate()
    target = Math.round(target)
    const steps = target - this.rate
    const interval = duration / Math.abs(steps) * 1000
    const step = steps / Math.abs(steps)
    this.changingRateIntervalID = GeometryUtils.setIntervalCustom(_ => {
      this.rate += step
      if (this.rate === target) {
        this.stopChangingRate()
      }
    }, interval)
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
    return this.rate
  }
}

export default Pulse

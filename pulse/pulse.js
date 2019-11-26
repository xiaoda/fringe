class Pulse {
  constructor (options = {}) {
    const rate = options.rate || 80
    this.interval = 60 / rate
    this.callback = null
    this.pulsing()
  }

  pulsing () {
    GeometryUtils.setIntervalCustom(_ => {
      if (this.callback) this.callback()
    }, this.interval * 1000)
  }

  onPulse (callback) {
    this.callback = callback
  }
}

export default Pulse

class Pulse {
  constructor (options = {}) {
    this.rate = options.rate || 80
    this.callback = null
    this.pulsing()
  }

  changeRate (target, duration) {
    target = Math.round(target)
    const steps = target - this.rate
    const interval = duration / Math.abs(steps) * 1000
    const step = steps / Math.abs(steps)
    const intervalID = GeometryUtils.setIntervalCustom(_ => {
      this.rate += step
      if (this.rate === target) clearInterval(intervalID)
    }, interval)
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
}

export default Pulse

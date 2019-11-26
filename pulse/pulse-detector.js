class PulseDetector {
  constructor () {
    this.records = []
    this.rate = 0
    this.monitorInterval = 1
    this.afterMonitorActions = []
    this.locks = {
      monitor: false
    }
    this.monitor()
  }

  monitor () {
    GeometryUtils.setIntervalCustom(_ => {
      if (this.records.length < 2) return
      this._lock('monitor')
      const currentTimestamp = +new Date() / 1000
      for (let i = this.records.length - 1; i >= 0; i--) {
        const timestamp = this.records[i]
        if (currentTimestamp - timestamp > 60) {
          this.records.splice(i, 1)
        }
      }
      this.rate = Math.round(
        (this.records.length - 1) /
        (this.records[this.records.length - 1] - this.records[0])
        * 60
      )
      this._unlock('monitor')
      this.afterMonitorActions.forEach(action => action())
      this.afterMonitorActions = []
    }, this.monitorInterval * 1000)
  }

  detect () {
    const timestamp = +new Date() / 1000
    const updateAction = _ => {
      this.records.push(timestamp)
    }
    if (this._isLocked('monitor')) {
      this.afterMonitorActions.push(updateAction)
    } else updateAction()
  }

  getRate () {
    return this.rate
  }

  _lock (name) {
    this.locks[name] = true
  }

  _unlock (name) {
    this.locks[name] = false
  }

  _isLocked (name) {
    return this.locks[name]
  }
}

export default PulseDetector

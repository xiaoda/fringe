class Clock {
  constructor (options = {}) {
    this.rate = options.rate || 1
    this.optionFactory('startTimeStamp', null)
    this.optionFactory('pauseTimeStamp', null)
    this.optionFactory('pausedTime', 0)
  }

  optionFactory (name, value) {
    const property = `_${name}`
    this[property] = value
    this[name] = option => {
      if (typeof option === 'undefined') {
        return this[property]
      } else {
        this[property] = option
      }
    }
  }

  start () {
    let errorMsg
    if (this.startTimeStamp()) {
      errorMsg = 'Clock already started.'
    }
    if (errorMsg) return console.error(errorMsg)

    const currentTimeStamp = new Date().getTime()
    this.startTimeStamp(currentTimeStamp)
  }

  pause () {
    let errorMsg
    if (!this.startTimeStamp()) {
      errorMsg = 'Clock not started yet.'
    } else if (this.pauseTimeStamp()) {
      errorMsg = 'Clock already paused.'
    }
    if (errorMsg) return console.error(errorMsg)

    const currentTimeStamp = new Date().getTime()
    this.pauseTimeStamp(currentTimeStamp)
  }

  continue () {
    let errorMsg
    if (!this.startTimeStamp()) {
      errorMsg = 'Clock not started yet.'
    } else if (!this.pauseTimeStamp()) {
      errorMsg = 'Clock not paused yet.'
    }
    if (errorMsg) return console.error(errorMsg)

    const currentTimeStamp = new Date().getTime()
    const pauseTimeStamp = this.pauseTimeStamp()
    const pausedTime = currentTimeStamp - pauseTimeStamp
    this.pausedTime(this.pausedTime() + pausedTime)
    this.pauseTimeStamp(null)
  }

  reset () {
    this.startTimeStamp(null)
    this.pauseTimeStamp(null)
  }

  getPassedTime () {
    let milliseconds
    const startTimeStamp = this.startTimeStamp()
    if (startTimeStamp) {
      const currentTimeStamp = new Date().getTime()
      const pausedTime = this.pausedTime()
      milliseconds = (currentTimeStamp - startTimeStamp - pausedTime) * this.rate
    } else {
      milliseconds = 0
    }
    const timeText = _generateTimeText(milliseconds)

    function _generateTimeText (milliseconds) {
      const seconds = Math.floor(milliseconds / 1000)
      const minutes = Math.floor(seconds      / 60  )
      const hours   = Math.floor(minutes      / 60  )
      const days    = Math.floor(hours        / 24  )
      const months  = Math.floor(days         / 30  )
      const years   = Math.floor(months       / 12  )
      const timeText = [
        years   ? `${years}y`        : '',
        months  ? `${months % 12}m`  : '',
        days    ? `${days % 30}d`    : '',
        hours   ? `${hours % 24}h`   : '',
        minutes ? `${minutes % 60}m` : '',
        `${seconds % 60}s`
      ].join(' ').trim()
      return timeText
    }

    return [milliseconds, timeText]
  }
}

export default Clock

class Clock {
  constructor (options = {}) {
    this.rate = options.rate || 1
    this.optionFactory('startTimeStamp', null)
    this.optionFactory('pauseTimeStamp', null)
    this.optionFactory('pausedTime', 0)
    this.optionFactory('latestTimeText', Clock.generateTimeText(0))
    this.optionFactory('cyclicTimerID', null)
    this.cyclicCallbacks = {
      year:   [],
      month:  [],
      day:    [],
      hour:   [],
      minute: [],
      second: []
    }
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
    this.startTimer()
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
    this.stopTimer()
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
    this.startTimer()
  }

  reset () {
    this.stopTimer()
    this.startTimeStamp(null)
    this.pauseTimeStamp(null)
    this.pausedTime(0)
    this.latestTimeText(Clock.generateTimeText(0))
    for (const cycle in this.cyclicCallbacks) {
      const callbacks = this.cyclicCallbacks[cycle]
      const timeTextUnit = cycle[0]
      callbacks.forEach(callback => {
        callback(`0${timeTextUnit}`)
      })
    }
  }

  getPassedTime () {
    let milliseconds
    const startTimeStamp = this.startTimeStamp()
    if (startTimeStamp) {
      const currentTimeStamp = new Date().getTime()
      const pauseTimeStamp = this.pauseTimeStamp()
      const pausedTime = this.pausedTime()
      milliseconds = (
        pauseTimeStamp ?
        pauseTimeStamp - startTimeStamp - pausedTime :
        currentTimeStamp - startTimeStamp - pausedTime
      )
    } else {
      milliseconds = 0
    }
    milliseconds *= this.rate
    const timeText = Clock.generateTimeText(milliseconds)
    return [milliseconds, timeText]
  }

  startTimer () {
    const cyclicTimerID = setInterval(_ => {
      const [milliseconds, timeText] = this.getPassedTime()
      const latestTimeText = this.latestTimeText()
      if (timeText === latestTimeText) return
      const changedCycles = []
      const [
        second, minute, hour, day, month, year
      ] = timeText.split(' ').reverse()
      const [
        latestSecond, latestMinute, latestHour,
        latestDay, latestMonth, latestYear
      ] = latestTimeText.split(' ').reverse()
      if (second !== latestSecond) changedCycles.push('second')
      if (minute !== latestMinute) changedCycles.push('minute')
      if (hour   !== latestHour)   changedCycles.push('hour')
      if (day    !== latestDay)    changedCycles.push('day')
      if (month  !== latestMonth)  changedCycles.push('month')
      if (year   !== latestYear)   changedCycles.push('year')
      changedCycles.forEach(cycle => {
        this.cyclicCallbacks[cycle].forEach(callback => {
          callback(Clock.shortenTimeText(timeText, cycle))
        })
      })
      this.latestTimeText(timeText)
    }, 0)
    this.cyclicTimerID(cyclicTimerID)
  }

  stopTimer () {
    const cyclicTimerID = this.cyclicTimerID()
    clearInterval(cyclicTimerID)
  }

  registerCyclicCallback (cycle, callback) {
    const callbacksCount = this.cyclicCallbacks[cycle].push(callback)
    const callbackIndex = callbacksCount - 1
    return callbackIndex
  }

  unregisterCyclicCallback (cycle, callbackIndex) {
    this.cyclicCallbacks[cycle].splice(callbackIndex, 1)
  }

  static generateTimeText (milliseconds) {
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

  static shortenTimeText (timeText, cycle) {
    const reference = [
      'second', 'minute', 'hour', 'day', 'month', 'year'
    ]
    const shortenedTimeText = timeText
      .split(' ')
      .reverse()
      .slice(reference.indexOf(cycle))
      .reverse()
      .join(' ')
    return shortenedTimeText
  }
}

export default Clock

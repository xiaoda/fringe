import BaseClass from './base.js'

/* Constants */
const RATE = 1500

class Clock extends BaseClass {
  constructor (options = {}) {
    super()
    this.rate = options.rate || RATE
    this.optionFactory('startTimeStamp', null)
    this.optionFactory('pauseTimeStamp', null)
    this.optionFactory('pausedTime', 0)
    this.optionFactory('cyclicTimerID', null)
    this.optionFactory(
      'latestTimeText',
      Clock.generateTimeText(0)
    )
    this.singleCallbacks = {}
    this.cyclicCallbacks = {
      year:   [],
      month:  [],
      day:    [],
      hour:   [],
      minute: [],
      second: []
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
        if (typeof callback !== 'function') return
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
      for (let timeStamp in this.singleCallbacks) {
        if (milliseconds < timeStamp) continue
        const callbacks = this.singleCallbacks[timeStamp]
        callbacks.forEach(callback => {
          if (typeof callback !== 'function') return
          callback(timeStamp)
        })
        delete this.singleCallbacks[timeStamp]
      }
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
      if (hour   !== latestHour  ) changedCycles.push('hour')
      if (day    !== latestDay   ) changedCycles.push('day')
      if (month  !== latestMonth ) changedCycles.push('month')
      if (year   !== latestYear  ) changedCycles.push('year')
      changedCycles.forEach(cycle => {
        const callbacks = this.cyclicCallbacks[cycle]
        callbacks.forEach(callback => {
          if (typeof callback !== 'function') return
          const shortenedTimeText = Clock.shortenTimeText(timeText, cycle)
          callback(shortenedTimeText)
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

  registerSingleCallback (timeStamp, callback) {
    const [currentTimeStamp] = this.getPassedTime()
    if (timeStamp < currentTimeStamp) return null
    if (!this.singleCallbacks[timeStamp]) {
      this.singleCallbacks[timeStamp] = []
    }
    const callbacksCount = this.singleCallbacks[timeStamp].push(callback)
    const callbackIndex = callbacksCount - 1
    return callbackIndex
  }

  unregisterSingleCallback (timeStamp, callbackIndex) {
    if (!this.singleCallbacks[timeStamp]) return
    this.singleCallbacks[timeStamp][callbackIndex] = null
  }

  registerCyclicCallback (cycle, callback) {
    const callbacksCount = this.cyclicCallbacks[cycle].push(callback)
    const callbackIndex = callbacksCount - 1
    return callbackIndex
  }

  unregisterCyclicCallback (cycle, callbackIndex) {
    this.cyclicCallbacks[cycle][callbackIndex] = null
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

  static generateMilliseconds (timeText) {
    const timeArray = timeText.split(' ')
    const units = [
      'y', 'm', 'd', 'h', 'm', 's'
    ]
    const times = [
      12 * 30 * 24 * 60 * 60,
      30 * 24 * 60 * 60,
      24 * 60 * 60,
      60 * 60,
      60,
      1
    ]
    let seconds = 0
    let tempIndex = 0
    units.forEach((unit, index) => {
      if (tempIndex > timeArray.length - 1) return
      const timeItem = timeArray[tempIndex]
      if (!timeItem.endsWith(unit)) return
      else if (unit === 'm') {
        const intactUnit = (
          index === units.indexOf('m') ?
          'month' :
          'minute'
        )
        let currentUnit = 'minute'
        if (
          tempIndex - 1 >= 0 &&
          timeArray[tempIndex].endsWith('y')
        ) currentUnit = 'month'
        else if (
          tempIndex + 1 < timeArray.length &&
          timeArray[tempIndex].endsWith('d')
        ) currentUnit = 'month'
        if (intactUnit !== currentUnit) return
      }
      let [value] = timeItem.match(/\d+/)
      value = Number(value)
      seconds += value * times[index]
      tempIndex ++
    })
    const milliseconds = seconds * 1000
    return milliseconds
  }

  static shortenTimeText (timeText, cycle) {
    const reference = [
      'second', 'minute', 'hour',
      'day', 'month', 'year'
    ]
    const units = [
      's', 'm', 'h', 'd', 'm', 'y'
    ]
    const index = reference.indexOf(cycle)
    let shortenedTimeText = timeText
      .split(' ')
      .reverse()
      .slice(index)
      .reverse()
      .join(' ')
    shortenedTimeText = (
      shortenedTimeText ?
      shortenedTimeText :
      `0${units[index]}`
    )
    return shortenedTimeText
  }
}

export default Clock

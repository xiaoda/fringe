class Days {
  constructor (options = {}) {
    this.today = options.today || 1
  }

  toNextDay () {
    this.today ++
  }
}

export default Days

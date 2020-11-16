const $days = new Component({
  elementId: 'days',
  data: {
    days: null
  },
  render () {
    const {days} = this.data
    const today = days ? days.today : 1
    return `
      <div>
        <strong>Day ${today}</strong>
      </div>
      <div>
        <button onClick="${this.instance}.toNextDay()">Next Day</button>
      </div>
    `
  },
  methods: {
    toNextDay () {
      const {days} = this.data
      days.toNextDay()
      updateComponents()
    }
  }
})

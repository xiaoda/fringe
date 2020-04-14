const $clockBlock = new Component({
  elementId: 'clockBlock',
  data: {
    rate: 1,
    timeText: '',
    status: 'initial',
    buttons: {
      start:    {disabled: false},
      pause:    {disabled: true},
      continue: {disabled: true},
      reset:    {disabled: true}
    }
  },
  created () {
    return
    GeometryUtils.setIntervalCustom(_ => {
      const [milliseconds, timeText] = window.getPassedTime()
      this.setData({timeText})
    }, 2000, 50)
  },
  render () {
    const {
      rate, timeText, buttons
    } = this.data
    return `
      <div>
        ${Object.keys(buttons).map(name => {
          const button = buttons[name]
          return `
            <button
              onClick="${this.instance}.clockAction('${name}')"
              ${button.disabled ? 'disabled' : ''}
            >
              ${name[0].toUpperCase()}${name.slice(1)}
            </button>
          `
        }).join('')}
      </div>
      <table border>
        <thead>
          <tr>
            <th>Rate</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>${rate}</td>
            <td>${timeText}</td>
          </tr>
        </tbody>
      </table>
    `
  },
  methods: {
    clockAction (action) {
      window.clockAction(action)
      const actionStatusMap = {
        start: 'running',
        pause: 'paused',
        continue: 'running',
        reset: 'initial'
      }
      const status = actionStatusMap[action]
      this.setData({status}, false)
      this.changeButtonsState()
    },
    changeButtonsState () {
      const {status, buttons} = this.data
      switch (status) {
        case 'initial':
          buttons.start.disabled = false
          buttons.pause.disabled = true
          buttons.continue.disabled = true
          buttons.reset.disabled = true
          break
        case 'running':
          buttons.start.disabled = true
          buttons.pause.disabled = false
          buttons.continue.disabled = true
          buttons.reset.disabled = false
          break
        case 'paused':
          buttons.start.disabled = true
          buttons.pause.disabled = true
          buttons.continue.disabled = false
          buttons.reset.disabled = false
          break
      }
      this.setData({buttons})
    }
  }
})

const $citiesBlock = new Component({
  elementId: 'citiesBlock',
  data: {
    cities: {}
  },
  render () {
    const {cities} = this.data
    return `
      <table border>
        <thead>
          <tr>
            <th>Name</th>
            <th>Airports</th>
            <th>Population</th>
          </tr>
        </thead>
        <tbody>
          ${Object.keys(cities).map(name => {
            const city = cities[name]
            return `
              <tr>
                <td>${name}</td>
                <td>${city.airports.join(',')}</td>
                <td>${city.population}</td>
              </tr>
            `
          }).join('')}
        </tbody>
      </table>
    `
  }
})

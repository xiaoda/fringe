const $clockComponent = new Component({
  elementId: 'clockComponent',
  data () {
    return {
      rate: 1,
      status: 'initial',
      timeText: '0h',
      buttons: {
        start:    {disabled: false},
        pause:    {disabled: true },
        continue: {disabled: true },
        reset:    {disabled: true }
      }
    }
  },
  render () {
    const {
      rate, timeText, buttons
    } = this.data
    return `
      <h3>Clock</h3>
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
      <table id="clockTable" border>
        <thead>
          <tr>
            <th>Rate</th>
            <th>Time</th>
            <th>Date</th>
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
    init () {
      window.clock.registerCyclicCallback('hour', timeText => {
        this.setData({timeText}, {
          partlyUpdateElementId: 'clockTable'
        })
        $citiesComponent.forceUpdate()
      })
    },
    clockAction (action) {
      window.clock[action]()
      const actionStatusMap = {
        start: 'running',
        pause: 'paused',
        continue: 'running',
        reset: 'initial'
      }
      const status = actionStatusMap[action]
      this.setData({status}, {
        needUpdate: false
      })
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

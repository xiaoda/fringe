const $clockComponent = new Component({
  elementId: 'clockComponent',
  data () {
    const data = {
      rate: 1,
      status: 'initial',
      initialDateText: '01/01 00:00',
      buttons: {
        start:    {disabled: false},
        pause:    {disabled: true },
        continue: {disabled: true },
        reset:    {disabled: true }
      }
    }
    data.dateText = data.initialDateText
    return data
  },
  render () {
    const {
      rate, dateText, buttons
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
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>${rate}</td>
            <td>${dateText}</td>
          </tr>
        </tbody>
      </table>
    `
  },
  methods: {
    init () {
      window.clock.registerCyclicCallback('hour', timeText => {
        const dateText = this.generateDateText(timeText)
        this.setData({dateText}, {
          partlyUpdateElementId: 'clockTable'
        })
        $citiesComponent.forceUpdate()
        $companiesComponent.forceUpdate({
          partlyUpdateElementId: 'companiesTable'
        })
      })
    },
    generateDateText (timeText) {
      const {initialDateText} = this.data
      const [
        initialDatePart, initialTimePart
      ] = initialDateText.split(' ')
      const [
        initialMonth, initialDay
      ] = initialDatePart.split('/')
      const [
        initialHour, initialMinute
      ] = initialTimePart.split(':')
      let dateArray = [
        Number(initialMonth), Number(initialDay),
        Number(initialHour), Number(initialMinute)
      ]
      timeText
        .split(' ')
        .map(text => Number(text.slice(0, text.length - 1)))
        .reverse()
        .forEach((value, index) => {
          const dateIndex = dateArray.length - index - 2
          if (dateIndex < 0) return
          dateArray[dateIndex] = dateArray[dateIndex] + value
        })
      dateArray = dateArray.map(value => {
        value = String(value)
        return (
          value.length < 2 ?
          `0${value}` :
          value
        )
      })
      const dateText = `
        ${dateArray[0]}/${dateArray[1]}
        ${dateArray[2]}:${dateArray[3]}
      `.trim().replace(/\s+/, ' ')
      return dateText
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
      $companiesComponent.forceUpdate()
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

const $clockComponent = new Component({
  elementId: 'clockComponent',
  data () {
    const data = {
      rate: 1,
      status: 'initial',
      initialDateText: '01/01 00:00',
      isNight: true,
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
      rate, dateText, isNight, buttons
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
      <table
        id="clockTable"
        class="${isNight ? 'night' : ''}"
        border
      >
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
        const isReset = (
          timeText.split(' ').length === 1 &&
          timeText.startsWith('0')
        )
        if (isReset) {
          window.initApp()
        } else {
          const hour = Number(
            timeText.split(' ').reverse()[0].replace('h', '')
          )
          const isNight = hour < 6 || hour >= 18
          const dateText = this.generateDateText(timeText)
          this.setData({
            dateText, isNight
          }, {
            partlyUpdateElementId: 'clockTable'
          })
          $citiesComponent.forceUpdate()
          $airplanesComponent.forceUpdate()
        }
      })
    },
    generateDateText (timeText) {
      const {initialDateText} = this.data
      const [
        initialDatePart, initialTimePart
      ] = initialDateText.split(' ')
      const [
        initialMonth = '01',
        initialDay = '01'
      ] = initialDatePart.split('/')
      const [
        initialHour = '00',
        initialMinute = '00',
        initialSecond = '00'
      ] = initialTimePart.split(':')
      let dateArray = [
        Number(initialMonth), Number(initialDay),
        Number(initialHour), Number(initialMinute),
        Number(initialSecond)
      ]
      const timeArray = timeText.split(' ')
      const units = [
        'm', 'd', 'h', 'm', 's'
      ]
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
        dateArray[index] += value
        tempIndex ++
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

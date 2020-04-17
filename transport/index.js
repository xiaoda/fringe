const $clockBlock = new Component({
  elementId: 'clockBlock',
  data () {
    return {
      rate: 1,
      status: 'initial',
      timeText: '0h',
      buttons: {
        start:    {disabled: false},
        pause:    {disabled: true},
        continue: {disabled: true},
        reset:    {disabled: true}
      }
    }
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
      <table id="clockTable" border>
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
    init () {
      window.clock.registerCyclicCallback('hour', timeText => {
        this.setData({timeText}, {
          partlyUpdateElementId: 'clockTable'
        })
        $citiesBlock.setData()
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
            <th rowspan="3">Name</th>
            <th rowspan="3">Airports</th>
            <th rowspan="3">Population</th>
            <th
              colspan="${Object.keys(cities).length * 2}"
            >
              Destinations
            </th>
          </tr>
          <tr>
            ${Object.keys(cities).map(name => `
              <th colspan="2">${name}</th>
            `).join('')}
          </tr>
          <tr>
            ${Object.keys(cities).map(name => {
              const city = cities[name]
              return `
                <th>Current</th>
                <th>Max</th>
              `
            }).join('')}
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
                ${Object.keys(cities).map(destName => {
                  const destCity = cities[destName]
                  return (
                    name === destName ?
                    `<td colspan="2"></td>` :
                    `
                      <td>${city.getCurrentTravelPopulation(destCity)}</td>
                      <td>${city.getTravelPopulation(destCity)}</td>
                    `
                  )
                }).join('')}
              </tr>
            `
          }).join('')}
        </tbody>
      </table>
    `
  }
})

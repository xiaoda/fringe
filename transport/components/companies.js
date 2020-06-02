const $companiesComponent = new Component({
  elementId: 'companiesComponent',
  data: {
    companies: {},
    airports: {},
    strategies: {}
  },
  render () {
    const {companies} = this.data
    const {status: clockStatus} = $clockComponent.data
    return `
      <h3>Companies</h3>
      <div>
        <!--
        <button
          onClick="${this.instance}.manuallyCreateFlight()"
          ${clockStatus === 'running' ? '' : 'disabled'}
        >
          New Flight
        </button>
        -->
      </div>
      <table id="companiesTable" border>
        <thead>
          <tr>
            <th rowspan="2">Company</th>
            <th rowspan="2">Airplane</th>
            <th rowspan="2">in Flight</th>
            <th colspan="2">Departure</th>
            <th colspan="2">Destination</th>
            <th rowspan="2">Seats</th>
            <th rowspan="2">Passengers</th>
            <th rowspan="2">Takeoff</th>
            <th rowspan="2">Arrival</th>
            <th rowspan="2">to Arrive</th>
          </tr>
          <tr>
            <th>City</th>
            <th>Airport</th>
            <th>City</th>
            <th>Airport</th>
          </tr>
        </thead>
        <tbody>
          ${Object.keys(companies).map(name => {
            const company = companies[name]
            return Object.keys(company.airplanes).map((planeName, index) => {
              const airplane = company.airplanes[planeName]
              return `
                <tr>
                  ${index === 0 ? `<td rowspan="2">${name}</td>` : ''}
                  <td>${planeName}</td>
                  <td>${
                    airplane.flight() ?
                    '<span class="yes">Y</span>' :
                    '<span class="no">N</span>'
                  }</td>
                  <td>${airplane.airport().city.name}</td>
                  <td>${airplane.airport().name}</td>
                  ${
                    airplane.flight() ?
                    `<td>${airplane.flight().destAirport.name}</td>` :
                    '<td class="no-data"></td>'
                  }
                  ${
                    airplane.flight() ?
                    `<td>${airplane.flight().destCity.name}</td>` :
                    '<td class="no-data"></td>'
                  }
                  <td>${airplane.seats}</td>
                  ${
                    airplane.flight() ?
                    `<td>${airplane.flight().passengers()}</td>` :
                    '<td class="no-data"></td>'
                  }
                  ${
                    airplane.flight() ?
                    `<td>${
                      $clockComponent.generateDateText(
                        airplane.flight().getTakeoffTimeText()
                      )
                    }</td>` :
                    '<td class="no-data"></td>'
                  }
                  ${
                    airplane.flight() ?
                    `<td>${
                      $clockComponent.generateDateText(
                        airplane.flight().getArriveTimeText()
                      )
                    }</td>` :
                    '<td class="no-data"></td>'
                  }
                  ${
                    airplane.flight() ?
                    `<td>${airplane.flight().getToArriveTimeText()}</td>` :
                    '<td class="no-data"></td>'
                  }
                </tr>
              `
            }).join('')
          }).join('')}
        </tbody>
      </table>
    `
  },
  methods: {
    init () {
      const {
        companies, airports, strategies
      } = this.data
      const {RoundTripStrategy} = strategies
      const airbusNo1 = companies.xiaoda.airplanes.AirbusNo1
      const strategy = new RoundTripStrategy({
        airports: [
          airports.PVG, airports.HKG
        ],
        passengers: 0
      })
      airbusNo1.applyStrategy(strategy)
    },
    manuallyCreateFlight () {
      const {
        companies, airports
      } = this.data
      const airbusNo1 = companies.xiaoda.airplanes.AirbusNo1
      if (airbusNo1.flight()) return
      const departAirport = airbusNo1.airport()
      const destAirport = (
        departAirport.name === 'PVG' ?
        airports.HKG :
        airports.PVG
      )
      airbusNo1.createFlight({
        departAirport,
        destAirport
      })
    }
  }
})

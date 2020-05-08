const $companiesComponent = new Component({
  elementId: 'companiesComponent',
  data: {
    companies: {},
    airports: {}
  },
  render () {
    const {companies} = this.data
    const {status: clockStatus} = $clockComponent.data
    return `
      <h3>Companies</h3>
      <div>
        <button
          onClick="${this.instance}.createFlight()"
          ${clockStatus === 'running' ? '' : 'disabled'}
        >
          Create Flight
        </button>
      </div>
      <table id="companiesTable" border>
        <thead>
          <tr>
            <th rowspan="2">Name</th>
            <th rowspan="2">Airplane</th>
            <th rowspan="2">in Flight</th>
            <th colspan="2">Location</th>
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
                  <td>
                    ${
                      airplane.flight() ?
                      '<span class="yes">Y</span>' :
                      '<span class="no">N</span>'
                    }
                  </td>
                  <td>${airplane.airport().city.name}</td>
                  <td>${airplane.airport().name}</td>
                  <td>
                    ${
                      airplane.flight() ?
                      airplane.flight().destAirport.name :
                      ''
                    }
                  </td>
                  <td>
                    ${
                      airplane.flight() ?
                      airplane.flight().destCity.name :
                      ''
                    }
                  </td>
                  <td>${airplane.seats}</td>
                  <td>
                    ${
                      airplane.flight() ?
                      airplane.flight().passengers() :
                      ''
                    }
                  </td>
                  <td>
                    ${
                      airplane.flight() ?
                      $clockComponent.generateDateText(
                        airplane.flight().getTakeoffTimeText()
                      ) :
                      ''
                    }
                  </td>
                  <td>
                    ${
                      airplane.flight() ?
                      $clockComponent.generateDateText(
                        airplane.flight().getArriveTimeText()
                      ) :
                      ''
                    }
                  </td>
                  <td>
                    ${
                      airplane.flight() ?
                      airplane.flight().getToArriveTimeText() :
                      ''
                    }
                  </td>
                </tr>
              `
            }).join('')
          }).join('')}
        </tbody>
      </table>
    `
  },
  methods: {
    createFlight () {
      const {
        companies, airports
      } = this.data
      const airbusNo1 = companies.xiaoda.airplanes.AirbusNo1
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

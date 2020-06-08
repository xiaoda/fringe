const $airplanesComponent = new Component({
  elementId: 'airplanesComponent',
  data: {
    companies: {}
  },
  render () {
    const {companies} = this.data
    return `
      <h3>Airplanes</h3>
      <table border>
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
          ${Object.keys(companies).map(companyName => {
            const company = companies[companyName]
            return Object.keys(company.airplanes).map(planeName => {
              const airplane = company.airplanes[planeName]
              return `
                <tr>
                  <td>${companyName}</td>
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
                    `<td>${airplane.flight().destCity.name}</td>` :
                    '<td class="no-data"></td>'
                  }
                  ${
                    airplane.flight() ?
                    `<td>${airplane.flight().destAirport.name}</td>` :
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
  }
})

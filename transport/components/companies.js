const $companiesComponent = new Component({
  elementId: 'companiesComponent',
  data: {
    companies: {}
  },
  render () {
    const {companies} = this.data
    return `
      <h3>Companies</h3>
      <table border>
        <thead>
          <tr>
            <th rowspan="2">Name</th>
            <th rowspan="2">Airplane</th>
            <th rowspan="2">on Flight</th>
            <th colspan="2">Location</th>
            <th colspan="2">Destination</th>
            <th rowspan="2">Seats</th>
            <th rowspan="2">Passengers</th>
            <th rowspan="2">Takeoff</th>
            <th rowspan="2">Arrival</th>
            <th rowspan="2">to Arrive</th>
          </tr>
          <tr>
            <th>Airport</th>
            <th>City</th>
            <th>Airport</th>
            <th>City</th>
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
                  <td>${airplane.airport().name}</td>
                  <td>${airplane.airport().city.name}</td>
                  <td></td>
                  <td></td>
                  <td>${airplane.seats}</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
              `
            }).join('')
          }).join('')}
        </tbody>
      </table>
    `
  }
})

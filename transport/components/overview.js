const $overviewComponent = new Component({
  elementId: 'overviewComponent',
  data: {
    companies: {}
  },
  render () {
    const {companies} = this.data
    return `
      <h3>Overview</h3>
      <table border>
        <thead>
          <tr>
            <th>Company</th>
            <th>Airplane</th>
            <th>Cities</th>
            <th>Flights</th>
            <th>Passengers</th>
            <th>Attendance</th>
            <th>Duration</th>
            <th>
              Duration<br/>
              /Seat
            </th>
          </tr>
        </thead>
        <tbody>
          ${Object.values(companies).map(company => {
            return Object.values(company.airplanes).map(airplane => {
              return `
                <tr>
                  <td>${company.name}</td>
                  <td>${airplane.name}</td>
                  <td></td>
                  <td></td>
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

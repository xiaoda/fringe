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
              const overview = airplane.overview()
              return `
                <tr>
                  <td>${company.name}</td>
                  <td>${airplane.name}</td>
                  <td>${overview.cities().join(',')}</td>
                  <td>${overview.flights()}</td>
                  <td>${overview.passengers()}</td>
                  <td>${overview.getAttendanceText()}</td>
                  <td>${overview.getDurationTimeText()}</td>
                  <td>${overview.getDurationTimeTextPerSeat()}</td>
                </tr>
              `
            }).join('')
          }).join('')}
        </tbody>
      </table>
    `
  }
})

const $airplanesComponent = new Component({
  elementId: 'airplanesComponent',
  data: {
    companies: {}
  },
  render () {
    const {companies} = this.data
    const $tdWithNoData = '<td class="no-data"></td>'
    return `
      <h3>Airplanes</h3>
      <table border>
        <thead>
          <tr>
            <th rowspan="2">Company</th>
            <th rowspan="2">Airplane</th>
            <th colspan="2">Departure</th>
            <th colspan="2">Destination</th>
            <th rowspan="2">Seats</th>
            <th rowspan="2">Passengers</th>
            <th rowspan="2">Takeoff</th>
            <th rowspan="2">Arrival</th>
            <th rowspan="2">Duration</th>
            <th rowspan="2">Duration<br/>/Seat</th>
          </tr>
          <tr>
            <th>City</th>
            <th>Airport</th>
            <th>City</th>
            <th>Airport</th>
          </tr>
        </thead>
        <tbody>
          ${Object.values(companies).map(company => {
            return Object.values(company.airplanes).map(airplane => {
              return `
                <tr>
                  <td>${company.name}</td>
                  <td>${airplane.name}</td>
                  <td>${airplane.airport().city.abbr}</td>
                  <td>${airplane.airport().name}</td>
                  ${
                    airplane.flight() ?
                    `
                      <td>${airplane.flight().destCity.abbr}</td>
                      <td>${airplane.flight().destAirport.name}</td>
                      <td>${airplane.seats}</td>
                      <td>${airplane.flight().passengers()}</td>
                      <td>${
                        $clockComponent.generateDateText(
                          airplane.flight().getTakeoffTimeText()
                        )
                      }</td>
                      <td>${
                        $clockComponent.generateDateText(
                          airplane.flight().getArriveTimeText()
                        )
                      }</td>
                      <td>${airplane.flight().getDurationTimeText()}</td>
                      <td>${airplane.flight().getDurationPerSeat()}</td>
                    ` :
                    `
                      ${$tdWithNoData.repeat(2)}
                      <td>${airplane.seats}</td>
                      ${$tdWithNoData.repeat(5)}
                    `
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

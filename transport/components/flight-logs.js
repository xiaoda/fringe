const channel = new BroadcastChannel('transport')

const $flightLogsComponent = new Component({
  elementId: 'flightLogsComponent',
  data: {
    logs: []
  },
  render () {
    const {logs} = this.data
    return `
      <h3>Flight Logs</h3>
      <table border>
        <thead>
          <tr>
            <th rowspan="2">Index</th>
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
          ${logs.map((log, index) => {
            return `
              <tr>
                <td>${logs.length - index}</td>
                <td>${log.company}</td>
                <td>${log.airplane}</td>
                <td>${log.departCityAbbr}</td>
                <td>${log.departAirport}</td>
                <td>${log.destCityAbbr}</td>
                <td>${log.destAirport}</td>
                <td>${log.seats}</td>
                <td>${log.passengers}</td>
                <td>${
                  $clockComponent.generateDateText(
                    log.takeoffTimeText
                  )
                }</td>
                <td>${
                  $clockComponent.generateDateText(
                    log.arriveTimeText
                  )
                }</td>
                <td>${log.durationTimeText}</td>
                <td>${log.durationPerSeat}</td>
              </tr>
            `
          }).join('')}
        </tbody>
      </table>
    `
  },
  created () {
    channel.onmessage = e => {
      const {
        action, data
      } = e.data
      const {logs} = this.data
      switch (action) {
        case 'flightLogs':
          this.setData({
            logs: data.reverse()
          })
          break
        case 'newFlightLog':
          logs.unshift(data)
          this.setData({logs})
      }
    }
    channel.postMessage({
      action: 'requestFlightLogs'
    })
  }
})

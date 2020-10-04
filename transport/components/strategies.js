const $strategiesComponent = new Component({
  elementId: 'strategiesComponent',
  data: {
    companies: {}
  },
  render () {
    const {companies} = this.data
    const $tdWithNoData = '<td class="no-data"></td>'
    return `
      <h3>Strategies</h3>
      <table border>
        <thead>
          <tr>
            <th>Company</th>
            <th>Airplane</th>
            <th>Cities</th>
            <th>Strategy</th>
            <th>Min<br/>Passengers</th>
          </tr>
        </thead>
        <tbody>
          ${Object.values(companies).map(company => {
            return Object.values(company.airplanes).map(airplane => {
              return `
                <tr>
                  <td>${company.name}</td>
                  <td>${airplane.name}</td>
                  ${
                    airplane.strategy() ?
                    `
                      <td>${
                        airplane.strategy().cities.map(city => {
                          return city.abbr
                        }).join(',')
                      }</td>
                      <td>${airplane.strategy().name}</td>
                      ${
                        airplane.strategy().minPassengers > 0 ?
                        `<td>${airplane.strategy().minPassengers}</td>` :
                        $tdWithNoData
                      }
                    ` :
                    $tdWithNoData.repeat(3)
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

const $strategiesComponent = new Component({
  elementId: 'strategiesComponent',
  data: {
    companies: {}
  },
  render () {
    const {companies} = this.data
    return `
      <h3>Strategies</h3>
      <table border>
        <thead>
          <tr>
            <th>Company</th>
            <th>Airplane</th>
            <th>Strategy</th>
            <th>Airports</th>
            <th>Passengers</th>
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
                  ${
                    airplane.strategy() ?
                    `<td>${airplane.strategy().name}</td>` :
                    '<td class="no-data"></td>'
                  }
                  ${
                    airplane.strategy() ?
                    `<td>${
                      airplane.strategy().airports.map(airport => {
                        return airport.name
                      }).join(',')
                    }</td>` :
                    '<td class="no-data"></td>'
                  }
                  ${
                    airplane.strategy() ?
                    `<td>${airplane.strategy().passengers}</td>` :
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

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
            <th>Cities</th>
            <th>Passengers</th>
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
                    `<td>${airplane.strategy().name}</td>` :
                    '<td class="no-data"></td>'
                  }
                  ${
                    airplane.strategy() ?
                    `<td>${
                      airplane.strategy().cities.map(city => {
                        return city.abbr
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

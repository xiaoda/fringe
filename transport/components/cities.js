const $citiesComponent = new Component({
  elementId: 'citiesComponent',
  data: {
    cities: {}
  },
  render () {
    const {cities} = this.data
    const $tdWithNoData = '<td class="no-data"></td>'
    return `
      <h3>Cities</h3>
      <table border>
        <thead>
          <tr>
            <th rowspan="2">City</th>
            <th
              colspan="${Object.keys(cities).length}"
            >
              Destinations
            </th>
          </tr>
          <tr>
            ${Object.values(cities).map(city => {
              return `
                <th>${city.abbr}</th>
              `
            }).join('')}
          </tr>
        </thead>
        <tbody>
          ${Object.values(cities).map(city => {
            return `
              <tr>
                <td>${city.name}</td>
                ${Object.values(cities).map(destCity => {
                  return (
                    city.name === destCity.name ?
                    $tdWithNoData :
                    `
                      <td>${city.getCurrentTravelPopulation(destCity)}</td>
                    `
                  )
                }).join('')}
              </tr>
            `
          }).join('')}
        </tbody>
      </table>
    `
  }
})

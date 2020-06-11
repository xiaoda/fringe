const $citiesComponent = new Component({
  elementId: 'citiesComponent',
  data: {
    cities: {}
  },
  render () {
    const {cities} = this.data
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
            ${Object.keys(cities).map(name => {
              const city = cities[name]
              return `
                <th>${city.abbr}</th>
              `
            }).join('')}
          </tr>
        </thead>
        <tbody>
          ${Object.keys(cities).map(name => {
            const city = cities[name]
            return `
              <tr>
                <td>${name}</td>
                ${Object.keys(cities).map(destName => {
                  const destCity = cities[destName]
                  return (
                    name === destName ?
                    `<td class="no-data"></td>` :
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

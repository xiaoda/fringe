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
            <th rowspan="3">City</th>
            <th rowspan="3">Airports</th>
            <th rowspan="3">Population</th>
            <th
              colspan="${Object.keys(cities).length * 2}"
            >
              Destinations
            </th>
          </tr>
          <tr>
            ${Object.keys(cities).map(name => `
              <th colspan="2">${name}</th>
            `).join('')}
          </tr>
          <tr>
            ${Object.keys(cities).map(name => {
              const city = cities[name]
              return `
                <th>Current</th>
                <th>Max</th>
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
                <td>${city.airports.join(',')}</td>
                <td>${city.population}</td>
                ${Object.keys(cities).map(destName => {
                  const destCity = cities[destName]
                  return (
                    name === destName ?
                    `<td colspan="2"></td>` :
                    `
                      <td>${city.getCurrentTravelPopulation(destCity)}</td>
                      <td>${city.getTravelPopulation(destCity)}</td>
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

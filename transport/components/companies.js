const $companiesComponent = new Component({
  elementId: 'companiesComponent',
  data: {
    companies: {}
  },
  render () {
    const {companies} = this.data
    return `
      <table border>
        <thead>
          <tr>
            <th>Name</th>
          </tr>
        </thead>
        <tbody>
          ${Object.keys(companies).map(name => {
            const company = companies[name]
            return `
              <tr>
                <td>${name}</td>
              </tr>
            `
          }).join('')}
        </tbody>
      </table>
    `
  }
})

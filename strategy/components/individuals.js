const $individuals = new Component({
  elementId: 'individuals',
  data: {
    scene: null
  },
  render () {
    const {scene} = this.data
    const doveData = {type: 'dove'}
    const hawkData = {type: 'hawk'}
    const totalData = {type: 'total'}
    if (scene) {
      const {individuals} = scene
      totalData.number = individuals.length
      doveData.number = individuals
        .filter(individual => individual.type === 'dove').length
      hawkData.number = individuals
        .filter(individual => individual.type === 'hawk').length
      doveData.percent = doveData.number / totalData.number
      hawkData.percent = hawkData.number / totalData.number
    }
    const data = [doveData, hawkData, totalData]
    return `
      <h3>Individuals</h3>
      <table border>
        <thead>
          <tr>
            <th>Type</th>
            <th>Number</th>
            <th>Percent</th>
          </tr>
        </thead>
        <tbody>
          ${data.map(individualData => {
            return `
              <tr>
                <td class="${individualData.type}">
                  ${utils.capitalize(individualData.type)}
                </td>
                <td>${individualData.number}</td>
                <td>${
                  individualData.type === 'total' ? '' :
                  utils.percentize(individualData.percent)
                }</td>
              </tr>
            `
          }).join('')}
        </tbody>
      </table>
    `
  }
})

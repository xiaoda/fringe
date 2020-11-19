const $selection = new Component({
  elementId: 'selection',
  data: {
    scene: null
  },
  render () {
    const {scene} = this.data
    let $content = null
    if (scene) {
      const matrixLength = Math.ceil(Math.sqrt(scene.foodPairCount))
      const matrixArray = new Array(matrixLength).fill()
      const rowLength = Math.ceil(scene.foodPairCount / matrixLength)
      const rowArray = new Array(rowLength).fill()
      $content = `
        <table class="selection-table" border>
          <thead>
            <tr>
              <th></th>
              ${matrixArray.map((item, index) => {
                return `<th>${index + 1}</th>`
              }).join('')}
            </tr>
          </thead>
          <tbody>
            ${rowArray.map((item, rowIndex) => {
              return `
                <tr>
                  <td>${rowIndex + 1}</td>
                  ${matrixArray.map((i, columnIndex) => {
                    const index = rowIndex * matrixLength + columnIndex
                    let $tableCell = null
                    if (index < scene.foodPairCount - 1) {
                      $tableCell = `
                        <td>
                          ${scene.foodIndividualsMap[index].map(individual => {
                            return `<i class="${individual.type}"></i>`
                          }).join('')}
                        </td>
                      `
                    }
                    return $tableCell
                  }).join('')}
                </tr>
              `
            }).join('')}
          </tbody>
        </table>
      `
    }
    return `
      <h3>Selection</h3>
      ${$content}
    `
  }
})

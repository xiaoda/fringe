class SceneLogs {
  constructor () {
    this.logs = []
  }

  addLog (scene) {
    const total = scene.individuals.length
    const dove = scene.individuals
      .filter(individual => individual.type === 'dove')
      .length
    const hawk = scene.individuals
      .filter(individual => individual.type === 'hawk')
      .length
    const dovePercent = utils.percentize(dove / total)
    const hawkPercent = utils.percentize(hawk / total)
    const log = {
      total, dove, hawk,
      dovePercent, hawkPercent
    }
    this.logs.push(log)
  }
}

export default SceneLogs

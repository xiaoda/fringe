class Scene {
  constructor (options = {}) {
    this.individuals = []
    this.foodPairCount = options.foodPairCount || 50
    this.foodTotalCount = this.foodPairCount * 2
    this.availableFood = this._initAvailableFood()
    this.foodIndividualMap = this._initFoodIndividualMap()
  }

  addIndividual (individual) {
    this.individuals.push(individual)
  }

  addIndividuals (individuals) {
    individuals.forEach(individual => {
      this.addIndividual(individual)
    })
  }

  allocateFood () {

  }

  _initAvailableFood () {
    const availableFood = []
    for (let i = 0; i < this.foodPairCount; i++) {
      availableFood.push(i)
    }
    return availableFood
  }

  _initFoodIndividualMap () {
    const foodIndividualMap = []
    for (let i = 0; i < this.foodPairCount; i++) {
      foodIndividualMap.push([])
    }
    return foodIndividualMap
  }
}

export default Scene

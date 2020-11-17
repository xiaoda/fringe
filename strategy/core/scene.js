class Scene {
  constructor (options = {}) {
    this.individuals = []
    this.foodPairCount = options.foodPairCount || 50
    this.foodTotalCount = this.foodPairCount * 2
    this._initAvailableFood()
    this._initFoodIndividualsMap()
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
    this._initAvailableFood()
    this._initFoodIndividualsMap()
    this.individuals.forEach(individual => {
      if (!this.availableFood.length) {
        console.error(
          'Scene allocateFood Error: Not enough food.'
        )
        return
      }
      const foodIndex = Math.floor(
        Math.random() * this.availableFood.length
      )
      const chosenFood = this.availableFood[foodIndex]
      this.foodIndividualsMap[chosenFood].push(individual)
      if (this.foodIndividualsMap[chosenFood].length >= 2) {
        const removeIndex = this.availableFood
          .findIndex(food => food === chosenFood)
        this.availableFood.splice(removeIndex, 1)
      }
    })
  }

  produceResult () {
    this.foodIndividualsMap.forEach(individuals => {
      // todo
    })
  }

  _initAvailableFood () {
    this.availableFood = []
    for (let i = 0; i < this.foodPairCount; i++) {
      this.availableFood.push(i)
    }
  }

  _initFoodIndividualsMap () {
    this.foodIndividualsMap = []
    for (let i = 0; i < this.foodPairCount; i++) {
      this.foodIndividualsMap.push([])
    }
  }
}

export default Scene

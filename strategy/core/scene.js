class Scene {
  constructor (options = {}) {
    this.individuals = []
    this.foodPairCount = options.foodPairCount || 50
    this.foodTotalCount = this.foodPairCount * 2
    this.resetDailyData()
  }

  resetDailyData () {
    this._resetIndividuals()
    this._resetAvailableFood()
    this._resetFoodIndividualsMap()
  }

  addIndividual (individual) {
    this.individuals.push(individual)
  }

  addIndividuals (individuals) {
    individuals.forEach(individual => {
      this.addIndividual(individual)
    })
  }

  selectFood () {
    this.individuals.forEach(individual => {
      if (!this.availableFood.length) {
        console.error(
          'Scene selectFood Error: Not enough food.'
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

  allocateFood () {
    this.foodIndividualsMap.forEach(individuals => {
      switch (individuals.length) {
        case 0:
          break
        case 1: {
          const [individual] = individuals
          individual.food = 2
          break
        }
        case 2: {
          const doveCount = individuals
            .filter(individual => individual.type === 'dove')
            .length
          const hawkCount = individuals
            .filter(individual => individual.type === 'hawk')
            .length
          if (doveCount === 2) {
            individuals.forEach(individual => {
              individual.food = 1
            })
          } else if (hawkCount === 2) {
            individuals.forEach(individual => {
              individual.food = 0
            })
          } else if (doveCount === 1 && hawkCount === 1) {
            individuals.forEach(individual => {
              switch (individual.type) {
                case 'dove':
                  individual.food = 0.5
                  break
                case 'hawk':
                  individual.food = 1.5
                  break
              }
            })
          }
        }
      }
    })
  }

  produceResult () {
    const nextDayIndividuals = []
    this.individuals.forEach(individual => {
      let surviveChance = individual.food
      if (surviveChance > 1) surviveChance = 1
      if (Math.random() < surviveChance) {
        nextDayIndividuals.push(individual)
      }
      let reproduceChance = individual.food - 1
      if (reproduceChance < 0) reproduceChance = 0
      if (Math.random() < reproduceChance) {
        nextDayIndividuals.push(individual.clone())
      }
    })
    this.individuals = nextDayIndividuals
  }

  _resetIndividuals () {
    this.individuals.forEach(individual => {
      individual.food = 0
    })
  }

  _resetAvailableFood () {
    this.availableFood = []
    for (let i = 0; i < this.foodPairCount; i++) {
      this.availableFood.push(i)
    }
  }

  _resetFoodIndividualsMap () {
    this.foodIndividualsMap = []
    for (let i = 0; i < this.foodPairCount; i++) {
      this.foodIndividualsMap.push([])
    }
  }
}

export default Scene

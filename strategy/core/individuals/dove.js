import Individual from './individual.js'

class Dove extends Individual {
  constructor (options = {}) {
    super({
      ...options,
      type: 'dove'
    })
  }
}

export default Dove

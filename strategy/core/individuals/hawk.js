import Individual from './individual.js'

class Hawk extends Individual {
  constructor (options = {}) {
    super({
      ...options,
      type: 'hawk'
    })
  }
}

export default Hawk

class BaseClass {
  optionFactory (name, value) {
    const property = `_${name}`
    this[property] = value
    this[name] = option => {
      if (typeof option === 'undefined') {
        return this[property]
      } else {
        this[property] = option
      }
    }
  }
}

export default BaseClass

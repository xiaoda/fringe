class Component {
  constructor (options = {}) {
    this.name = options.name
    this.selector = options.selector
    this.data = options.data || {}
    this.methods = options.methods || {}
    this.render = options.render || (_ => '')
    this.parent = null
    this.parentDataAlreadySet = false

    Object.keys(this.methods).forEach(key => {
      if (this[key]) return
      this[key] = this.methods[key]
    })
    this.render = this.render.bind(this)
    this.update()
  }

  getContainer () {
    return $(this.selector)
  }

  setData (dataObject) {
    Object.keys(dataObject).forEach(key => {
      this.data[key] = dataObject[key]
    })
    this.update()
  }

  setDataFromParent (dataObject) {
    if (this.parentDataAlreadySet) return
    this.parentDataAlreadySet = true
    this.setData(dataObject)
  }

  setParent (component) {
    this.parent = component
  }

  update () {
    const container = this.getContainer()
    if (container.length) {
      setTimeout(_ => {
        container.html(this.render())
      }, 0)
    } else if (this.parent) {
      this.parent.update()
    }
  }

  static sub (component, parentComponent, dataObject) {
    if (component instanceof Component) {
      component.setParent(parentComponent)
      if (dataObject) component.setDataFromParent(dataObject)
      return component.render()
    } else if (typeof component === 'function') {
      return component(dataObject)
    }
  }
}

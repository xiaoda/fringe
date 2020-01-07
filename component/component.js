const HOOKS = {
  created: 'created',
  updated: 'updated',
  mounted: 'mounted'
}

class Component {
  constructor (options = {}) {
    this.name = options.name
    this.data = (
      typeof options.data === 'function' ?
      options.data() :
      (
        typeof options.data === 'object' ?
        options.data :
        {}
      )
    )
    this.methods = options.methods || {}
    this.selector = options.selector
    this.parent = options.parent
    this.parentDataAlreadySet = false
    this.alreadyMounted = false
    this.render = _ => {
      const html = options.render.call(this)
      if (this.alreadyMounted) {
        this.triggerHook(HOOKS.updated)
      } else {
        this.alreadyMounted = true
        this.triggerHook(HOOKS.mounted)
      }
      return html
    }
    Object.keys(HOOKS).forEach(key => {
      const hook = HOOKS[key]
      if (typeof options[hook] !== 'function') return
      this[hook] = options[hook].bind(this)
    })
    Object.keys(this.methods).forEach(key => {
      if (this[key]) return
      this[key] = this.methods[key].bind(this)
    })

    this.triggerHook(HOOKS.created)
    this.update()
  }

  getContainer () {
    return $(this.selector)
  }

  setData (dataObject, needUpdate = true) {
    Object.keys(dataObject).forEach(key => {
      this.data[key] = dataObject[key]
    })
    if (needUpdate) this.update()
  }

  setDataFromParent (dataObject) {
    if (this.parentDataAlreadySet) return
    this.parentDataAlreadySet = true
    this.setData(dataObject, false)
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

  triggerHook (funName) {
    const fun = this[funName]
    if (typeof fun === 'function') fun()
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

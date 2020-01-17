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
    this.optionFactory('parentDataAlreadySet', false)
    this.optionFactory('alreadyMounted', false)
    this.optionFactory('needRerender', true)
    this.optionFactory('lastRenderContent', '')
    this.render = _ => {
      if (typeof options.render !== 'function') return ''
      const html = options.render.call(this)
      this.lastRenderContent(html)
      this.needRerender(false)
      if (this.alreadyMounted()) {
        this.triggerHook(HOOKS.updated)
      } else {
        this.alreadyMounted(true)
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
    this.needRerender(true)
    if (needUpdate) this.update()
  }

  setDataFromParent (dataObject) {
    if (this.parentDataAlreadySet()) return
    this.parentDataAlreadySet(true)
    this.setData(dataObject, false)
  }

  setParent (component) {
    if (this.parent) return
    this.parent = component
  }

  update () {
    const container = this.getContainer()
    if (container.length) {
      setTimeout(_ => {
        container.html(this.render())
      }, 0)
    } else if (this.parent) {
      this.parent.needRerender(true)
      this.parent.update()
    }
  }

  triggerHook (funName) {
    const fun = this[funName]
    if (typeof fun === 'function') fun()
  }

  optionFactory (funName, value) {
    const property = `_${funName}`
    this[property] = value
    this[funName] = option => {
      if (typeof option === 'undefined') {
        return this[property]
      } else {
        this[property] = option
      }
    }
  }

  static sub (component, parentComponent, dataObject) {
    if (component instanceof Component) {
      component.setParent(parentComponent)
      if (dataObject) component.setDataFromParent(dataObject)
      return (
        component.needRerender() ?
        component.render() :
        component.lastRenderContent()
      )
    } else if (typeof component === 'function') {
      return component(dataObject)
    }
  }

  static dispatchInstances (keys, factory, namePrefix) {
    const instances = eval(namePrefix)
    Object.keys(instances).forEach(name => {
      if (!keys.includes(name)) delete instances[name]
    })
    keys.forEach(name => {
      if (instances[name]) return
      instances[name] = new Component(factory({
        name: `${namePrefix}.${name}`
      }))
    })
  }
}

window._components = {}

class Component {
  constructor (options = {}) {
    this.instanceName = options.instanceName
    this.instance = options.instance
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
    this.optionFactory('parent', null)
    this.optionFactory('currentChildren', [])
    this.optionFactory('lastRenderChildren', [])
    this.optionFactory('parentDataAlreadySet', false)
    this.optionFactory('alreadyMounted', false)
    this.optionFactory('needRerender', true)
    this.optionFactory('lastRenderContent', '')
    this.render = _ => {
      if (typeof options.render !== 'function') return ''
      const html = options.render.call(this)
      this.lastRenderContent(html)
      this.handleSubComponents()
      this.needRerender(false)
      if (this.alreadyMounted()) {
        this.triggerHook('updated')
      } else {
        this.alreadyMounted(true)
        this.triggerHook('mounted')
      }
      return html
    }
    Object.keys(this.getHook()).forEach(key => {
      const hook = this.getHook(key)
      if (typeof options[hook] !== 'function') return
      this[hook] = options[hook].bind(this)
    })
    Object.keys(this.methods).forEach(key => {
      if (this[key]) return
      this[key] = this.methods[key].bind(this)
    })
    this.triggerHook('created')
    this.update()
  }

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

  getHook (key) {
    const hooks = {
      created: 'created',
      updated: 'updated',
      mounted: 'mounted'
    }
    return key ? hooks[key] : hooks
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
    component.currentChildren().push(this)
    if (this.parent()) return
    this.parent(component)
  }

  update () {
    const container = this.getContainer()
    if (container.length) {
      setTimeout(_ => {
        container.html(this.render())
      }, 0)
    } else if (this.parent()) {
      this.parent().needRerender(true)
      this.parent().update()
    }
  }

  triggerHook (name) {
    const hook = this.getHook(name)
    const fun = this[hook]
    if (typeof fun === 'function') fun()
  }

  subComponent (component, dataObject) {
    if (
      typeof component === 'object' &&
      !(component instanceof Component)
    ) {
      if (!component.instanceName) {
        console.error('Sub component lacks of instance name.')
        return ''
      }
      const instanceName = `
        ${this.instanceName}__${component.instanceName}
      `.replace(/\s/g, '').replace('window._components.', '')
      if (window._components[instanceName]) {
        component = window._components[instanceName]
      } else {
        component = Component.create({
          ...component,
          instanceName
        })
      }
    }
    if (component instanceof Component) {
      component.setParent(this)
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

  handleSubComponents () {
    const prevInstancesName = this.lastRenderChildren().map(instance => {
      return instance.instanceName
    })
    const instancesName = this.currentChildren().map(instance => {
      return instance.instanceName
    })
    prevInstancesName.forEach(name => {
      if (!instancesName.includes(name)) {
        delete window._components[name]
      }
    })
    this.lastRenderChildren(this.currentChildren())
    this.currentChildren([])
  }

  static create (options = {}) {
    const instanceName = options.instanceName ? options.instanceName : `
      C${Number(new Date())}
      ${String(Math.random()).replace('.', '')}
    `.replace(/\s/g, '')
    window._components[instanceName] = new Component({
      ...options,
      instanceName,
      instance: `window._components.${instanceName}`
    })
    return window._components[instanceName]
  }
}

window._components = {}

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
        this.triggerHook(this.getHook('updated'))
      } else {
        this.alreadyMounted(true)
        this.triggerHook(this.getHook('mounted'))
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

    this.triggerHook(this.getHook('created'))
    this.update()
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

  subComponent (component, dataObject) {
    if (
      typeof component === 'object' &&
      !(component instanceof Component)
    ) {
      const componentName = `
        ${this.name}__${component.name}
      `.replace(/\s/g, '').replace('window._components.', '')
      if (window._components[componentName]) {
        component = window._components[componentName]
      } else {
        component = Component.create({
          ...component,
          name: componentName
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

  static create (options = {}) {
    const componentName = options.name ? options.name : `
      C${Number(new Date())}
      ${String(Math.random()).replace('.', '')}
    `.replace(/\s/g, '')
    window._components[componentName] = new Component({
      ...options,
      name: `window._components.${componentName}`
    })
    return window._components[componentName]
  }
}

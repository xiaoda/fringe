window._components = {}

class Component {
  constructor (options = {}) {
    this.instanceName = (
      options.instanceName ?
      options.instanceName :
      `C${(Math.random() + 1).toString(36).substr(2, 5)}`
    )
    this.instance = `window._components.${this.instanceName}`
    window._components[this.instanceName] = this
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
    this.elementId = options.elementId
    this.optionFactory('parent', null)
    this.optionFactory('currentChildren', [])
    this.optionFactory('lastRenderChildren', [])
    this.optionFactory('parentDataAlreadySet', false)
    this.optionFactory('lastParentData', '{}')
    this.optionFactory('alreadyMounted', false)
    this.optionFactory('needRerender', true)
    this.optionFactory('lastRenderContent', '')
    this.render = _ => {
      if (typeof options.render !== 'function') return ''
      if (!this.needRerender()) return this.lastRenderContent()
      const html = options.render.call(this)
      this.lastRenderContent(html)
      this.needRerender(false)
      this.handleSubComponents()
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

  setData (dataObject, needUpdate = true) {
    Object.keys(dataObject).forEach(key => {
      this.data[key] = dataObject[key]
    })
    this.needRerender(true)
    if (needUpdate) this.update()
  }

  setDataFromParent (dataObject) {
    if (this.parentDataAlreadySet()) {
      if (
        this.lastParentData() === JSON.stringify(dataObject)
      ) return
      this.setData(dataObject, false)
    } else {
      this.parentDataAlreadySet(true)
      this.setData(dataObject, false)
    }
    this.lastParentData(JSON.stringify(dataObject))
  }

  setParent (component) {
    if (!this.parent()) this.parent(component)
    component.currentChildren().push(this)
  }

  update () {
    const container = document.getElementById(this.elementId)
    if (container) {
      setTimeout(_ => {
        container.innerHTML = this.render()
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
        console.error('Sub Component lacks of Instance Name.')
        return ''
      }
      const instanceName = `
        ${this.instanceName}__${component.instanceName}
      `.replace(/\s/g, '')
      component = (
        window._components[instanceName] ?
        window._components[instanceName] :
        new Component({
          ...component,
          instanceName
        })
      )
    }
    if (component instanceof Component) {
      component.setParent(this)
      if (dataObject) component.setDataFromParent(dataObject)
      return component.render()
    } else if (typeof component === 'function') {
      return component(dataObject)
    }
  }

  handleSubComponents () {
    const prevInstancesName = this.lastRenderChildren()
      .map(instance => {
        return instance.instanceName
      })
    const instancesName = this.currentChildren()
      .map(instance => {
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
}

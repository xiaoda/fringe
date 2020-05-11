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
    this.initialData = JSON.parse(JSON.stringify(this.data))
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
    setTimeout(_ => {
      this.update()
    }, 0)
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
      mounted: 'mounted',
      updated: 'updated',
      beforeDestroy: 'beforeDestroy'
    }
    return key ? hooks[key] : hooks
  }

  setData (dataObject = {}, options = {}) {
    const {
      needUpdate = true,
      partlyUpdateElementId
    } = options
    Object.keys(dataObject).forEach(key => {
      this.data[key] = dataObject[key]
    })
    this.needRerender(true)
    if (needUpdate) {
      this.update({
        partlyUpdateElementId
      })
    }
  }

  setDataFromParent (dataObject = {}) {
    if (this.parentDataAlreadySet()) {
      if (
        this.lastParentData() === JSON.stringify(dataObject)
      ) return
      this.setData(dataObject, {
        needUpdate: false
      })
    } else {
      this.parentDataAlreadySet(true)
      this.setData(dataObject, {
        needUpdate: false
      })
    }
    this.lastParentData(JSON.stringify(dataObject))
  }

  setParent (component) {
    if (!this.parent()) this.parent(component)
    component.currentChildren().push(this)
  }

  update (options = {}) {
    const {
      partlyUpdateElementId
    } = options
    const partlyUpdateElement = document.getElementById(
      partlyUpdateElementId
    )
    const container = document.getElementById(this.elementId)
    if (partlyUpdateElement) {
      const newDOM = new DOMParser()
        .parseFromString(this.render(), 'text/html')
        .getElementById(partlyUpdateElementId)
      const newHTML = new XMLSerializer()
        .serializeToString(newDOM)
      partlyUpdateElement.innerHTML = newHTML
    } else if (container) {
      container.innerHTML = this.render()
    } else if (this.parent()) {
      this.parent().needRerender(true)
      this.parent().update()
    }
  }

  forceUpdate (options = {}) {
    this.setData({}, {
      ...options,
      needUpdate: true
    })
  }

  triggerHook (name) {
    const hook = this.getHook(name)
    const fun = this[hook]
    if (typeof fun !== 'function') return
    if (hook === this.getHook('beforeDestroy')) {
      this.lastRenderChildren().forEach(child => {
        child.triggerHook('beforeDestroy')
      })
    }
    fun()
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
        window._components[name].triggerHook('beforeDestroy')
        delete window._components[name]
      }
    })
    this.lastRenderChildren(this.currentChildren())
    this.currentChildren([])
  }
}

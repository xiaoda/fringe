class Component {
  constructor (options = {}) {
    this.container = $(options.selector)
    this.data = options.data || {}
    this.methods = options.methods || {}
    this.content = options.content || (_ => '')

    if (!this.container.length) return
    Object.keys(this.methods).forEach(key => {
      this.methods[key] = this.methods[key].bind(this)
    })
    this.content = this.content.bind(this)
    this.render()
  }

  setData (dataObject) {
    Object.keys(dataObject).forEach(key => {
      this.data[key] = dataObject[key]
    })
    this.render()
  }

  render () {
    this.container.empty().html(this.content())
  }
}

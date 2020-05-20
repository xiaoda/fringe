const $flightLogsComponent = new Component({
  elementId: 'flightLogsComponent',
  data: {
    logs: []
  },
  render () {
    const {logs} = this.data
    return `
      <h3>Flight Logs</h3>
      <table></table>
    `
  }
})

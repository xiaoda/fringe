import lines from './lines.js'

class Route {
  constructor () {
    this.lines = lines
    this.stationLinesMap = {}
    this._processLines(this.lines)
  }

  _processLines (lines) {
    lines.forEach(line => {
      line.stations.forEach(station => {
        if (!this.stationLinesMap[station]) {
          this.stationLinesMap[station] = []
        }
        this.stationLinesMap[station].push(line.name)
      })
    })
  }

  _getLineByName (name) {
    return this.lines.find(line => line.name === name)
  }

  _getNextStation (line, station, direction = 1) {
    line = this._getLineByName(line)
    const index = line.stations.indexOf(station)
    let nextIndex = index + direction
    if (nextIndex < 0) {
      nextIndex = line.loop ? line.stations.length - 1 : -1
    } else if (nextIndex > line.stations.length - 1) {
      nextIndex = line.loop ? 0 : -1
    }
    return nextIndex < 0 ? null : line.stations[nextIndex]
  }

  _getRecursiveRoutes (station, end, prevQueue, routes) {
    this.stationLinesMap[station].forEach(line => {
      const queue = GeometryUtils.clone(prevQueue)
      const lastQueueItem =
        queue.length > 0 ?
        queue[queue.length - 1] :
        {}
      const queueItem = {
        line, station
      }
      if (
        queue.some(item => item.line === line) &&
        lastQueueItem.line !== line
      ) return
      if (lastQueueItem.line !== line) {
        queueItem.lastLine = lastQueueItem.line
      }
      queue.push(queueItem)
      if (station === end) {
        routes.push(queue)
        return
      }
      Array(1, -1).forEach(direction => {
        const nextStation = this._getNextStation(line, station, direction)
        if (!nextStation) return
        else if (queue.some(item => item.station === nextStation)) return
        this._getRecursiveRoutes(nextStation, end, queue, routes)
      })
    })
  }

  _getRoutesWithLeastStations (routes) {
    const stationsNumRoutesMap = {}
    routes.forEach(route => {
      const stationsNum = String(route.length)
      if (!stationsNumRoutesMap[stationsNum]) {
        stationsNumRoutesMap[stationsNum] = []
      }
      stationsNumRoutesMap[stationsNum].push(route)
    })
    const leastStationsNum = Math.min(...Object.keys(stationsNumRoutesMap).map(num => Number(num)))
    return stationsNumRoutesMap[String(leastStationsNum)]
  }

  _getRoutesWithLeastTransfer (routes) {
    const transferNumRoutesMap = {}
    routes.forEach(route => {
      const transferNum = route.filter(item => item.lastLine).length
      if (!transferNumRoutesMap[transferNum]) {
        transferNumRoutesMap[transferNum] = []
      }
      transferNumRoutesMap[transferNum].push(route)
    })
    const leastTransferNum = Math.min(...Object.keys(transferNumRoutesMap).map(num => Number(num)))
    return transferNumRoutesMap[String(leastTransferNum)]
  }

  getPossibleRoutes (start, end) {
    const rawRoutes = []
    this._getRecursiveRoutes(start, end, [], rawRoutes)
    const routesWithLeastStations = GeometryUtils.chain(
      rawRoutes,
      this._getRoutesWithLeastStations,
      this._getRoutesWithLeastTransfer
    )
    const routesWithLeastTrasnfer = GeometryUtils.chain(
      rawRoutes,
      this._getRoutesWithLeastTransfer,
      this._getRoutesWithLeastStations
    )
    console.log('Least Stations', routesWithLeastStations)
    console.log('Least Transfer', routesWithLeastTrasnfer)
  }
}

export default Route

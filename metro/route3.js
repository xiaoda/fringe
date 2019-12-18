import lines from './lines.js'

/**
 * Find the routes by stations distance
 */

class Route {
  constructor () {
    this.lines = lines
    this.stationLinesMap = this.generateStationLinesMap(this.lines)
    this.stationsDistance = []
    this.stationConnectionsMap = {}
    console.log('lines', this.lines)
    console.log('stationLinesMap', this.stationLinesMap)
  }

  generateStationLinesMap (lines) {
    const stationLinesMap = {}
    lines.forEach(line => {
      line.stations.forEach(station => {
        if (!stationLinesMap[station]) {
          stationLinesMap[station] = []
        }
        stationLinesMap[station].push(line.name)
      })
    })
    return stationLinesMap
  }

  generateStationsData (start, end) {
    let findEnd = false
    this.stationConnectionsMap = {}
    this.stationsDistance = []
    let count = 0
    while (
      !findEnd &&
      (
        Object.keys(this.stationConnectionsMap).length <
        Object.keys(this.stationLinesMap).length - 1
      ) &&
      count < 999
    ) {
      const prevStations = count ? this.stationsDistance[count - 1] : [start]
      const tempStationConnectionsMap = {}
      this.stationsDistance[count] = []
      prevStations.forEach(prevStation => {
        const stations = this.getClosestStations(prevStation)
        stations.forEach(station => {
          if (
            Object.keys(this.stationConnectionsMap).includes(station) ||
            station === start
          ) return
          if (!tempStationConnectionsMap[station]) {
            tempStationConnectionsMap[station] = []
          }
          if (count) tempStationConnectionsMap[station].push(prevStation)
          if (!this.stationsDistance[count].includes(station)) {
            this.stationsDistance[count].push(station)
          }
        })
        if (stations.includes(end)) findEnd = true
      })
      Object.keys(tempStationConnectionsMap).forEach(station => {
        this.stationConnectionsMap[station] = tempStationConnectionsMap[station]
      })
      count++
    }
    console.log('stationsDistance', this.stationsDistance)
    console.log('stationConnectionsMap', this.stationConnectionsMap)
  }

  getClosestStations (station, lines = []) {
    const closestStations = []
    if (!lines.length) lines = this.stationLinesMap[station]
    lines.forEach(line => {
      const lineData = this.lines.find(lineItem => lineItem.name === line)
      const {stations, loop} = lineData
      const index = stations.indexOf(station)
      let preIndex = index - 1
      let postIndex = index + 1
      if (preIndex < 0 && loop) {
        preIndex = stations.length - 1
      }
      if (postIndex > stations.length - 1 && loop) {
        postIndex = 0
      }
      if (preIndex >= 0) closestStations.push(stations[preIndex])
      if (postIndex < stations.length) closestStations.push(stations[postIndex])
    })
    return GeometryUtils.unique(closestStations)
  }

  getStationsStack (start, end) {
    let stationsStack = Array([end])
    let connections = this.stationConnectionsMap[end].map(station => {
      return {
        station,
        prevStation: end
      }
    })
    let count = 0
    while (connections.length && count < 999) {
      const nextConnections = []
      const newStationsStack = []
      connections.forEach(connection => {
        this.stationConnectionsMap[connection.station].forEach(station => {
          const tempNextConnection = {
            station,
            prevStation: connection.station
          }
          if (nextConnections.find(nextConnection => {
            return (
              nextConnection.station === tempNextConnection.station &&
              nextConnection.prevStation === tempNextConnection.prevStation
            )
          })) return
          nextConnections.push(tempNextConnection)
        })
        stationsStack.forEach(stack => {
          if (stack[stack.length - 1] === connection.prevStation) {
            newStationsStack.push([...stack, connection.station])
          }
        })
      })
      connections = nextConnections
      stationsStack = newStationsStack
      count++
    }
    return stationsStack.map(stack => {
      return [start, ...stack.reverse()]
    })
  }

  getSharedLines (...stations) {
    const linesCounter = {}
    stations.forEach(station => {
      this.stationLinesMap[station].forEach(line => {
        if (!linesCounter[line]) linesCounter[line] = 0
        linesCounter[line]++
      })
    })
    return Object.keys(linesCounter).filter(line => {
      return linesCounter[line] === stations.length
    })
  }

  getSharedLinesBetweenStations (stationA, stationB) {
    return this.stationLinesMap[stationA].filter(line => {
      return this.getClosestStations(stationA, [line]).includes(stationB)
    })
  }

  processRoutesData (stationsStack) {
    const routes = []
    const linesStack = []
    const linesStackByLevel = []
    stationsStack.forEach((station, index) => {
      if (!index) return
      const prevStation = stationsStack[index - 1]
      linesStack.push(this.getSharedLinesBetweenStations(prevStation, station))
    })
    linesStack.forEach((lines, index) => {
      if (index) {
        linesStackByLevel[index] = []
        linesStackByLevel[index - 1].forEach(lastLevelLines => {
          lines.forEach(line => {
            linesStackByLevel[index].push([...lastLevelLines, line])
          })
        })
      } else {
        linesStackByLevel[index] = lines.map(line => [line])
      }
    })
    const processedLinesStack = linesStackByLevel[linesStackByLevel.length - 1]
    processedLinesStack.forEach(lines => {
      const route = []
      stationsStack.forEach((station, index) => {
        const routeItem = {
          station,
          line: lines[index] ? lines[index] : lines[index - 1]
        }
        if (index) {
          const lastLine = lines[index - 1]
          if (routeItem.line !== lastLine) routeItem.lastLine = lastLine
        }
        route.push(routeItem)
      })
      routes.push(route)
    })
    return routes
  }

  getRoutesWithLeastTransfer (routes) {
    const transferNumRoutesMap = {}
    routes.forEach(route => {
      const transferNum = route.filter(item => item.lastLine).length
      if (!transferNumRoutesMap[transferNum]) {
        transferNumRoutesMap[transferNum] = []
      }
      transferNumRoutesMap[transferNum].push(route)
    })
    const leastTransferNum = Math.min(
      ...Object.keys(transferNumRoutesMap).map(num => Number(num))
    )
    return transferNumRoutesMap[String(leastTransferNum)]
  }

  getPossibleRoutes (start, end) {
    const rawRoutes = []
    this.generateStationsData(start, end)
    const stationsStack = this.getStationsStack(start, end)
    stationsStack.forEach(stack => {
      rawRoutes.push(...this.processRoutesData(stack))
    })
    const routesWithLeastStations = this.getRoutesWithLeastTransfer(rawRoutes)
    console.log('Least Stations (Accurate)', routesWithLeastStations)
  }
}

export default Route

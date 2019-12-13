import lines from './lines.js'

class Route {
  constructor () {
    this.lines = lines
    this.stationLinesMap = this.generateStationLinesMap(this.lines)
    this.lineConnectionsMap = this.generateLineConnectionsMap(
      this.lines, this.stationLinesMap
    )
    this.linesStackMap = this.generateLinesStackMap(this.lineConnectionsMap)
    console.log('lines', this.lines)
    console.log('stationLinesMap', this.stationLinesMap)
    console.log('lineConnectionsMap', this.lineConnectionsMap)
    console.log('linesStackMap', this.linesStackMap)
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

  generateLineConnectionsMap (lines, stationLinesMap) {
    const lineConnectionsMap = {}
    lines.forEach(line => {
      lineConnectionsMap[line.name] = []
    })
    Object.keys(stationLinesMap).forEach(station => {
      const linesAtStation = stationLinesMap[station]
      if (linesAtStation.length < 2) return
      linesAtStation.forEach(line => {
        lineConnectionsMap[line].push(...linesAtStation)
      })
    })
    Object.keys(lineConnectionsMap).forEach(line => {
      lineConnectionsMap[line] = Array.from(
        new Set(lineConnectionsMap[line])
      ).filter(connection => connection !== line)
    })
    return lineConnectionsMap
  }

  generateLinesStackMap (lineConnectionsMap) {
    const linesStackMap = {}
    Object.keys(lineConnectionsMap).forEach(line => {
      linesStackMap[line] = {}
      lineConnectionsMap[line].forEach(connection => {
        linesStackMap[line][connection] = []
      })
      let count = 0
      while (
        Object.keys(linesStackMap[line]).length < this.lines.length - 1 &&
        count < 999
      ) {
        const tempStack = {}
        Object.keys(linesStackMap[line]).forEach(targetLine => {
          lineConnectionsMap[targetLine].forEach(connection => {
            if (connection === line) return
            if (Object.keys(linesStackMap[line]).includes(connection)) return
            if (!tempStack[connection]) tempStack[connection] = []
            tempStack[connection].push(targetLine)
          })
        })
        Object.keys(tempStack).forEach(connection => {
          linesStackMap[line][connection] = tempStack[connection]
        })
        count++
      }
    })
    return linesStackMap
  }

  getLinesStackBetweenlines (startLine, endLine) {
    const stack = []
    const _getRecursiveLines = (src, dest, queue = []) => {
      const tempStack = this.linesStackMap[src][dest]
      if (tempStack.length) {
        tempStack.forEach(stackItem => {
          const tempQueue = GeometryUtils.clone(queue)
          tempQueue.unshift(stackItem)
          _getRecursiveLines(src, stackItem, tempQueue)
        })
      } else {
        stack.push([startLine, ...queue, endLine])
      }
    }
    _getRecursiveLines(startLine, endLine)
    return stack
  }

  getTransferStationsBetweenLines (lineA, lineB) {
    const lineAStations = this.lines.find(line => line.name === lineA).stations
    const lineBStations = this.lines.find(line => line.name === lineB).stations
    return lineAStations.filter(station => lineBStations.includes(station))
  }

  getStationsBetweenStations (line, stationA, stationB) {
    if (stationA === stationB) return Array([stationA])
    const lineData = this.lines.find(lineItem => lineItem.name === line)
    const indexOfStationA = lineData.stations.indexOf(stationA)
    const indexOfStationB = lineData.stations.indexOf(stationB)
    const minIndex = Math.min(indexOfStationA, indexOfStationB)
    const maxIndex = Math.max(indexOfStationA, indexOfStationB)
    let stationsData = []
    {
      const stations = lineData.stations.slice(minIndex, maxIndex + 1)
      if (indexOfStationA > indexOfStationB) stations.reverse()
      stationsData.push(stations)
    }
    if (lineData.loop) {
      const tempStations = lineData.stations.slice(maxIndex).concat(
        lineData.stations.slice(0, maxIndex)
      )
      const newIndex = lineData.stations.length - maxIndex + minIndex + 1
      const stations = tempStations.slice(0, newIndex)
      if (indexOfStationA < indexOfStationB) stations.reverse()
      stationsData.push(stations)
    }
    return stationsData
  }

  getRoutesWithStartEndStack (start, end, stack) {
    const rawRoutes = []
    let processedRoutes = []
    let prevStations = [start]
    stack.forEach((line, index) => {
      rawRoutes[index] = []
      if (index === stack.length - 1) {
        prevStations.forEach(prevStation => {
          rawRoutes[index].push(
            ...this.getStationsBetweenStations(
              line, prevStation, end
            )
          )
        })
      } else {
        const nextLine = stack[index + 1]
        const transferStations = this.getTransferStationsBetweenLines(line, nextLine)
        prevStations.forEach(prevStation => {
          transferStations.forEach(transferStation => {
            rawRoutes[index].push(
              ...this.getStationsBetweenStations(
                line, prevStation, transferStation
              )
            )
          })
        })
        prevStations = transferStations
      }
    })
    rawRoutes.forEach((levelRoutes, index) => {
      if (index) {
        const tempRoutes = []
        processedRoutes.forEach(processedRoute => {
          levelRoutes.forEach(levelRoute => {
            const processedRouteLastItem = processedRoute[processedRoute.length - 1].station
            const levelRouteFirstItem = levelRoute[0]
            if (processedRouteLastItem === levelRouteFirstItem) {
              tempRoutes.push(processedRoute.slice(0, processedRoute.length - 1).concat(
                levelRoute.map((station, i) => {
                  const tempData = {
                    station,
                    line: stack[index]
                  }
                  if (!i) tempData.lastLine = stack[index - 1]
                  return tempData
                })
              ))
            }
          })
        })
        processedRoutes = tempRoutes
      } else {
        processedRoutes = levelRoutes.map(levelRoute => {
          return levelRoute.map(station => {
            return {
              station,
              line: stack[index]
            }
          })
        })
      }
    })
    return processedRoutes
  }

  getRoutesWithLeastStations (routes) {
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

  getRoutesWithLeastTransfer (routes) {
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
    const startLines = this.stationLinesMap[start]
    const endLines = this.stationLinesMap[end]
    startLines.forEach(startLine => {
      endLines.forEach(endLine => {
        this.getLinesStackBetweenlines(startLine, endLine).map(stack => {
          rawRoutes.push(...this.getRoutesWithStartEndStack(start, end, stack))
        })
      })
    })
    const routesWithLeastStations = GeometryUtils.chain(
      rawRoutes,
      this.getRoutesWithLeastStations,
      this.getRoutesWithLeastTransfer
    )
    console.log('Least Stations', routesWithLeastStations)
    const routesWithLeastTrasnfer = GeometryUtils.chain(
      rawRoutes,
      this.getRoutesWithLeastTransfer,
      this.getRoutesWithLeastStations
    )
    console.log('Least Transfer', routesWithLeastTrasnfer)
  }
}

export default Route

import lines from './lines.js'

class Route {
  constructor () {
    this.lines = lines
    this.stationLinesMap = this._processLines(this.lines)
    this.detailedLines = this._processDetailedLines(this.lines, this.stationLinesMap)
  }

  _processLines (lines) {
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

  _processDetailedLines (lines, stationLinesMap) {
    return lines.map(line => {
      return {
        name: line.name,
        loop: line.loop,
        stations: line.stations.map(station => {
          const stationData = {
            name: station
          }
          const stationLinesData = stationLinesMap[station]
          if (stationLinesData.length > 1) {
            stationData.transfers = [
              ...stationLinesData.filter(stationLine => stationLine !== line.name)
            ]
          }
          return stationData
        })
      }
    })
  }

  _getLineByName (name) {
    return this.lines.find(line => line.name === name)
  }

  _getDetailedLineByName (name) {
    return this.detailedLines.find(line => line.name === name)
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

  _getStationsBetween2 (line, start, end) {
    line = this._getLineByName(line)
    let allStationsArr = []
    if (line.loop) {
      const startIndex = line.stations.indexOf(start)
      allStationsArr.push(
        Array(line.stations[startIndex]).concat(
          ...line.stations.slice(startIndex + 1),
          ...line.stations.slice(0, startIndex)
        ),
        line.stations.slice(startIndex + 1).concat(
          ...line.stations.slice(0, startIndex),
          line.stations[startIndex]
        )
      )
    } else {
      allStationsArr.push(line.stations)
    }
    const stationsBetween2 = []
    allStationsArr.forEach(allStations => {
      const startIndex = allStations.indexOf(start)
      const endIndex = allStations.indexOf(end)
      const tempStations = allStations.slice(
        Math.min(startIndex, endIndex),
        Math.max(startIndex, endIndex) + 1
      )
      if (startIndex > endIndex) tempStations.reverse()
      stationsBetween2.push(tempStations)
    })
    return stationsBetween2
  }

  _getRecursiveRoutes (station, end, routes, prevQueue) {
    this.recursiveCount++
    if (!prevQueue) prevQueue = {route: [], lines: []}
    if (prevQueue.lines.length > routes.minTransfers + 1) return
    else if (prevQueue.route.length > routes.minStations) return
    this.stationLinesMap[station].forEach(line => {
      const queue = GeometryUtils.clone(prevQueue)
      const lastLine =
        queue.lines.length > 0 ?
        queue.lines[queue.lines.length - 1] :
        null
      const queueItem = {line, station}
      if (queue.lines.includes(line)) {
        if (lastLine !== line) return // been on the current line
      } else {
        queue.lines.push(line) // add current line to history
        if (lastLine && lastLine !== line) queueItem.lastLine = lastLine // transfer
      }
      queue.route.push(queueItem)
      if (station === end) { // bingo!
        routes.data.push(queue.route)
        routes.minStations = Math.min(
          routes.minStations,
          queue.route.length
        )
        routes.minTransfers = Math.min(
          routes.minTransfers,
          queue.route.filter(station => station.lastLine).length
        )
        return
      }
      Array(1, -1).forEach(direction => {
        const nextStation = this._getNextStation(line, station, direction)
        if (!nextStation) return // no station
        else if (queue.route.some(item => item.station === nextStation)) return // been on the station
        this._getRecursiveRoutes(nextStation, end, routes, queue)
      })
    })
  }

  _getRecursiveRoutesUntilTransfer (station, end, routes, prevQueue, lines) {
    this.recursiveCount++
    if (!prevQueue) prevQueue = {route: [], lines: []}
    if (!lines) lines = this.stationLinesMap[station]
    if (prevQueue.lines.length > routes.minTransfers + 1) return
    else if (prevQueue.route.length > routes.minStations) return
    lines.forEach(line => {
      const queue = GeometryUtils.clone(prevQueue)
      const lastLine =
        queue.lines.length > 0 ?
        queue.lines[queue.lines.length - 1] :
        null
      if (queue.lines.includes(line)) {
        if (lastLine !== line) return // been on the current line
      } else {
        queue.lines.push(line) // add current line to history
      }
      const detailedLine = this._getDetailedLineByName(line)
      const terminal = detailedLine.stations.find(tempStation => {
        return tempStation.name === end
      })
      if (terminal) { // bingo!
        this._getStationsBetween2(
          line, station, terminal.name
        ).forEach(stations => {
          const tempQueue = GeometryUtils.clone(queue)
          let transferStation
          if (tempQueue.route.length) {
            transferStation = tempQueue.route.pop() // remove duplicate station
          }
          let checkDuplicate = true
          stations.forEach(station => {
            if (tempQueue.route.some(item => item.station === station)) {
              checkDuplicate = false
            }
          })
          if (!checkDuplicate) return // been on the station
          tempQueue.route.push(...stations.map((station, index) => {
            const stationObj = {line, station}
            if (!index && transferStation) {
              stationObj.lastLine = transferStation.line
            }
            return stationObj
          }))
          routes.data.push(tempQueue.route)
          routes.minStations = Math.min(
            routes.minStations,
            tempQueue.route.length
          )
          routes.minTransfers = Math.min(
            routes.minTransfers,
            tempQueue.route.filter(station => station.lastLine).length
          )
        })
      } else {
        detailedLine.stations.filter(tempStation => {
          return !!tempStation.transfers && tempStation.name !== station
        }).forEach(tempStation => {
          if (queue.route.some(item => item.station === tempStation.name)) return
          this._getStationsBetween2(
            line, station, tempStation.name
          ).forEach(stations => {
            const tempQueue = GeometryUtils.clone(queue)
            let transferStation
            if (tempQueue.route.length) {
              transferStation = tempQueue.route.pop() // remove duplicate station
            }
            let checkDuplicate = true
            stations.forEach(station => {
              if (tempQueue.route.some(item => item.station === station)) {
                checkDuplicate = false
              }
            })
            if (!checkDuplicate) return // been on the station
            tempQueue.route.push(...stations.map((station, index) => {
              const stationObj = {line, station}
              if (!index && transferStation) {
                stationObj.lastLine = transferStation.line
              }
              return stationObj
            }))
            this._getRecursiveRoutesUntilTransfer(
              tempStation.name, end, routes, tempQueue, tempStation.transfers
            )
          })
        })
      }
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

  getPossibleRoutesV1 (start, end) {
    const rawRoutes = {
      data: [],
      minStations: 999,
      minTransfers: 999
    }
    this.recursiveCount = 0
    this._getRecursiveRoutes(start, end, rawRoutes)
    console.log('Recursive Count', this.recursiveCount)
    /*
    const routesWithLeastStations = GeometryUtils.chain(
      rawRoutes.data,
      this._getRoutesWithLeastStations,
      this._getRoutesWithLeastTransfer
    )
    console.log('Least Stations', routesWithLeastStations)
    */
    const routesWithLeastTrasnfer = GeometryUtils.chain(
      rawRoutes.data,
      this._getRoutesWithLeastTransfer,
      this._getRoutesWithLeastStations
    )
    console.log('Least Transfer', routesWithLeastTrasnfer)
  }

  getPossibleRoutesV2 (start, end) {
    const rawRoutes = {
      data: [],
      minStations: 999,
      minTransfers: 999
    }
    this.recursiveCount = 0
    this._getRecursiveRoutesUntilTransfer(start, end, rawRoutes)
    console.log('Recursive Count', this.recursiveCount)
    /*
    const routesWithLeastStations = GeometryUtils.chain(
      rawRoutes.data,
      this._getRoutesWithLeastStations,
      this._getRoutesWithLeastTransfer
    )
    console.log('Least Stations', routesWithLeastStations)
    */
    const routesWithLeastTrasnfer = GeometryUtils.chain(
      rawRoutes.data,
      this._getRoutesWithLeastTransfer,
      this._getRoutesWithLeastStations
    )
    console.log('Least Transfer', routesWithLeastTrasnfer)
  }
}

export default Route

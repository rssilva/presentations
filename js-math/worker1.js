const PointUtils = {
  getCloserPoints (points) {
    const distanceMapped = []

    points.forEach((point) => {
      distanceMapped.push({
        point,
        distances: this.getCloserByDistance(points, point)
      })
    })
    console.log(distanceMapped.length)
    const paths = this.detectPaths(distanceMapped)
    console.log('hooooooooooo')
    return paths
  },

  getCloserByDistance (arr, point, distance = 1) {
    const distances = arr.map(({x, y}, index) => {
      const pow1 = Math.pow(point.x - x, 2)
      const pow2 = Math.pow(point.y - y, 2)

      return {d: Math.sqrt( pow1 + pow2 ), index }
    })

    return distances.sort((a, b) => a.d - b.d).splice(1)
  },

  detectPaths (points) {
    const paths = [[]]
    const added = []
    let pathIndex = 0

    let index = 0

    points = points.concat([])

    for (let i = 0; i < points.length - 1; i++) {
      const current = points[index] || {}
      const notAdded = this.findNotAdded(added, current.distances)
      let next = notAdded[0] || {}

      if (current.point) {
        paths[pathIndex].push(current.point)
      }

      if (!next.index) {
        next = this.findNextPathBegin(points, added)[0] || {}
        next = next[0] || {}

        pathIndex++
        paths.push([])
      }

      added.push(index)
      index = next.index
    }

    return paths
  },

  findNextPathBegin (points, added) {
    return points.map(({distances}) => {
      return distances.filter((distance) => !added.includes(distance.index))
    })
  },

  findNotAdded (added, distances = []) {
    return distances.filter((distance) => {
      return !added.includes(distance.index) && distance.d < 10
    })
  }
}


self.addEventListener('message', function(e) {
  var data = e.data
  console.log(e)

  switch (data.cmd) {
    case 'getCloserPoints':
      self.postMessage({points: PointUtils.getCloserPoints(data.matrix)})
      break
    case 'stop':
      self.postMessage('stoooooooop')
      self.close() // Terminates the worker.
      break
    default:
      self.postMessage('Unknown command: ' + data.msg)
  }
}, false)

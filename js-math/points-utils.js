const PointUtils = {
  getCloserPoints (points) {
    const closer = []

    points.forEach((point) => {
      closer.push({
        point,
        distances: this.getCloserByDistance(points, point)
      })
    })

    const sorted = this.sortByCloser(closer)
    console.log(closer)
    console.log(sorted)

    return sorted
  },

  getCloserByDistance (arr, point, distance = 1) {
    const distances = arr.map(({x, y}, index) => {
      const pow1 = Math.pow(point.x - x, 2)
      const pow2 = Math.pow(point.y - y, 2)

      return {d: Math.sqrt( pow1 + pow2 ), index }
    })

    return distances.sort((a, b) => a.d - b.d).splice(1)
  },

  sortByCloser (points) {
    const added = []

    points = points.concat([])
    let sorted = []
    let index = 0

    for (let i = 0; i < points.length - 1; i++) {
      const current = points[index]
      sorted.push(current.point)

      const next = this.findNotAdded(added, current.distances)[0] || {}
      index = next.index

      added.push(index)
    }

    return sorted
  },

  findNotAdded (added, distances) {
    return distances.filter(({index}) => {
      return !added.includes(index)
    })
  }
}

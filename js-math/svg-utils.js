const colorPlot = (i) => {
  let r = Math.floor(i/2)
  let g = Math.floor(i/5)
  let b = Math.floor(i/8)

  if (r > 250) {
    r = i - r
  }

  if (g > 250) {
    g = i - r
  }

  if (b > 250) {
    b = i - b
  }

  return {r, g, b}
}

const SVG = {
  init (el) {
    this.el = el
  },

  plotPoints (points) {
    let str = ''

    points.forEach((point, i) => {
      const {r, g, b} = colorPlot(i)

      str += `<circle cx="${point.x}" cy="${point.y}" r="1" fill="rgba(${r}, ${g}, ${b}, 255)"/>`
    })

    this.el.innerHTML += str
  },

  plotLines (points) {
    let d = ''

    d += `M${points[0].x} ${points[0].y}`

    points.forEach((point, i) => {
      const {r, g, b} = colorPlot(i)

      d += `L${point.x} ${point.y}`
    })

    let path = `<path fill="#F7931E" stroke="tomato" d="${d}"/>`

    this.el.innerHTML += path
  },

  new (el) {
    return Object.create(this, {})
  }
}

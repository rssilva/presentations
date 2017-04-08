const svgElement = document.getElementById('svg1')
const xAxis = []

for (let i = 0; i < 24; i++) {
  xAxis.push(i)
}

const width = svgElement.width.baseVal.value
const sliceSize = width / (xAxis.length - 1)

const AMOUNT = 100
const TAX = 10
const points = []
const colors = ['#1aa6b7', '#fe424d', '#000']

let max = null
let min = null

for (let i = 0; i < xAxis.length; i++) {
  const a = AMOUNT * Math.pow(1 + TAX/100, xAxis[i])
  const b = 300 * Math.cos(xAxis[i])

  const values = [
    a
  ]

  const x = sliceSize * i

  const currentMax = _.max(values)
  const currentMin = _.min(values)

  max = currentMax > max ? currentMax : max
  min = currentMin < min ? currentMin : min

  points.push({x, values})
}

const plotGraphs = (el, points = [[]], min, max, colors) => {
  const rangeSize = Math.abs(Math.abs(max) + Math.abs(min))
  const height = el.height.baseVal.value

  points[0].values.forEach((v, index) => {
    let d = ''

    points.forEach(({x, values}, pointIndex) => {
      let scaledY = (values[index] / rangeSize) * height
      scaledY += Math.abs(min) / rangeSize * height

      if (pointIndex === 0) {
        d += `M${x} ${height - scaledY} `
      }

      d += `L${x} ${height - scaledY} `
    })

    let path = `<path
      fill="none"
      stroke="${colors[index]}"
      stroke-width="5"
      d="${d}"/>`

    el.innerHTML += path
  })
}

plotGraphs(svgElement, points, min, max, colors)

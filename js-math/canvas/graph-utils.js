const plotGraphs = (ctx, points = [[]], min, max, colors) => {
  const rangeSize = Math.abs(Math.abs(max) + Math.abs(min))
  const { height } = ctx.canvas

  points[0].values.forEach((v, index) => {
    ctx.strokeStyle = colors[index]
    ctx.beginPath()

    points.forEach(({x, values}) => {
      let scaledY = (values[index] / rangeSize) * height
      scaledY += Math.abs(min) / rangeSize * height

      ctx.lineTo(x, height - scaledY)
    })

    ctx.stroke()
  })

}

const evaluateXAxis = (begin, end, step) => {
  const xAxis = []

  for (let i = begin; i <= end; i+= step) {
    xAxis.push(i)
  }

  return xAxis
}

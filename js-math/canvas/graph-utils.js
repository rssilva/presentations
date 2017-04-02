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

const plotSquare = (xm, ym, side, angle) => {
  ctx.beginPath()
  ctx.strokeStyle = '#022d41'
  ctx.lineWidth = 2

  const littleDiagonal = side * Math.sqrt(2)/2

  const toRad1 = (angle - 135) * Math.PI / 180
  const toRad2 = (angle - 45) * Math.PI / 180
  const toRad3 = (angle + 45) * Math.PI / 180
  const toRad4 = (angle + 135) * Math.PI / 180

  const v1 = {
    x: xm + littleDiagonal * Math.sin(toRad1),
    y: ym + littleDiagonal * Math.cos(toRad1),
  }

  const v2 = {
    x: xm + littleDiagonal * Math.sin(toRad2),
    y: ym + littleDiagonal * Math.cos(toRad2),
  }

  const v3 = {
    x: xm + littleDiagonal * Math.sin(toRad3),
    y: ym + littleDiagonal * Math.cos(toRad3),
  }

  const v4 = {
    x: xm + littleDiagonal * Math.sin(toRad4),
    y: ym + littleDiagonal * Math.cos(toRad4),
  }

  const v5 = v1

  ctx.moveTo(v1.x, v1.y)

  ctx.lineTo(v2.x, v2.y)
  ctx.lineTo(v3.x, v3.y)
  ctx.lineTo(v4.x, v4.y)
  ctx.lineTo(v5.x, v5.y)
  ctx.lineTo(v1.x, v1.y)
  ctx.stroke()
}

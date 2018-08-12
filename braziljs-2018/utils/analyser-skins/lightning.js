class Lightning { //eslint-disable-line
  constructor ({ ctx, colors, width, startY }) {
    this.ctx = ctx
    this.canvasWidth = ctx.canvas.width
    this.canvasHeight = ctx.canvas.height

    this._colors = colors

    this.setColors(colors)
    this.setDimensions(width, startY)
  }

  setColors (colors) {
    this.colors = [
      `rgba(${colors[0].r}, ${colors[0].g}, ${colors[0].b}, ${colors[0].a || 1})`,
      `rgba(${colors[1].r}, ${colors[1].g}, ${colors[1].b}, ${colors[1].a || 1})`,
      `rgba(${colors[2].r}, ${colors[2].g}, ${colors[2].b}, ${colors[2].a || 1})`
    ]
  }

  setDimensions (width, startY) {
    this.width = width

    this.startBlueX = (this.canvasWidth / 2) - (0.1633 * this.width)
    this.startY = startY

    this.startRedX = this.startBlueX + 0.0968 * this.width
  }

  draw (opacity = 1) {
    // this.drawBars()

    this.ctx.lineWidth = 1

    if (opacity < 1) {
      const colors = this._colors.map((color) => {
        color.a = opacity

        return color
      })

      this.setColors(colors)
    }

    // cool effects, remember it
    // this.ctx.shadowBlur = 100
    // this.ctx.shadowColor = this.colors[0]
    // this.ctx.globalAlpha = 0.3

    this.drawBlue()
    this.drawRed()
  }

  drawBlue () {
    this.ctx.beginPath()
    this.ctx.strokeStyle = this.colors[0]

    this.ctx.moveTo(this.startBlueX, this.startY)

    this.ctx.lineTo(this.startBlueX - (0.2630 * this.width), 0.7355 * this.width)
    this.ctx.lineTo(this.startBlueX + (0.05347 * this.width), this.startY)

    this.ctx.fillStyle = this.colors[0]
    this.ctx.fill()

    this.ctx.beginPath()

    this.ctx.moveTo(this.startBlueX - 0.0361 * this.width, 0.7471 * this.width)
    this.ctx.lineTo(this.startBlueX - 0.3092 * this.width, 1.3815 * this.width)
    this.ctx.lineTo(this.startBlueX + 0.0187 * this.width, 0.7326 * this.width)

    this.ctx.strokeStyle = this.colors[0]
    this.ctx.fill()
    this.ctx.stroke()
  }

  drawRed () {
    this.ctx.beginPath()

    this.ctx.moveTo(this.startRedX, this.startY)
    this.ctx.strokeStyle = this.colors[2]

    this.ctx.lineTo(this.startRedX - 0.3872 * this.width, this.startY + 0.8063 * this.width)
    this.ctx.lineTo(this.startRedX - 0.0347 * this.width, this.startY + 0.7255 * this.width)
    this.ctx.lineTo(this.startRedX - 0.4335 * this.width, this.startY + 1.4407 * this.width)
    this.ctx.lineTo(this.startRedX + 0.4147 * this.width, this.startY + 0.5318 * this.width)
    this.ctx.lineTo(this.startRedX + 0.1185 * this.width, this.startY + 0.5867 * this.width)
    this.ctx.lineTo(this.startRedX + 0.5665 * this.width, this.startY)

    this.ctx.fillStyle = this.colors[2]
    this.ctx.fill()
    this.ctx.stroke()
  }

  drawBars () {
    const red = `rgba(${255}, ${30}, ${0}, ${1})`
    const blue = `rgba(${82}, ${115}, ${255}, ${1})`

    const gradient = this.ctx.createLinearGradient(400, this.canvasHeight, 400, 0)
    gradient.addColorStop(0, red)
    gradient.addColorStop(1, blue)
    this.ctx.fillStyle = gradient

    this.drawBar(this.canvasWidth / 2, 10, 500)
  }

  drawBar (x, width, height) {
    this.ctx.fillRect(x, this.canvasHeight - height, width, height)
  }

  setOpacity (opacity) {
    // this.colors = this.colors.map((color) => {
    //   // color[4] = opacity
    //   return color
    // })
    // this.ctx.globalAlpha = opacity
  }
}

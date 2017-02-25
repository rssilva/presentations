'use strict'

const Kanvas = {
  init (canvas) {
    this.canvas = canvas
    this.context = canvas.getContext('2d')
  },

  getImageData () {
    return this.context.getImageData(0, 0, this.canvas.width, this.canvas.height)
  },

  toBlack (imageData) {
    const { data } = imageData
    const toBlack = new ImageData(imageData.data, imageData.width, imageData.height)

    for (let i = 0; i < data.length - 1; i += 4) {
      const r = data[i]
      const g = data[i + 1]
      const b = data[i + 2]

      if (r < 250 || g < 250 || b < 250) {
        toBlack.data[i] = 0
        toBlack.data[i + 1] = 0
        toBlack.data[i + 2] = 0
      }

      toBlack.data[i + 3] = data[i + 3]
      // toBlack.data[i + 3] = 255
    }

    return toBlack
  },

  splitRGB (imageData) {
    const { data } = imageData
    const rgb = {
      r: [],
      g: [],
      b: [],
      a: []
    }

    for (let i = 0; i < data.length - 1; i += 4) {
      rgb.r.push(data[i])
      rgb.g.push(data[i + 1])
      rgb.b.push(data[i + 2])
      rgb.a.push(data[i + 3])
    }

    return rgb
  },

  plotRGB (rgb) {
    const arr = new Uint8ClampedArray(rgb.r.length * 4)
    const imageData = new ImageData(arr, this.canvas.width, this.canvas.height)
    const { data } = imageData

    let counter = 0

    for (let i = 0; i < data.length - 1; i += 4) {
      data[i] = rgb.r[counter]
      data[i + 1] = rgb.g[counter]
      data[i + 2] = rgb.b[counter]
      data[i + 3] = rgb.a[counter]

      counter++
    }

    this.context.putImageData(imageData, 0, 0)
  },

  plotImageData (imageData) {
    this.context.putImageData(imageData, 0, 0)
  },

  getColor (imageData, rgb, tolerance = 1) {
    const { r, g, b, a } = rgb
    const { data } = imageData
    const filtered = new ImageData(imageData.width, imageData.height)
    console.log(b + tolerance)

    for (let i = 0; i < data.length - 1; i += 4) {
      const downRed = r - tolerance
      const upRed = r + tolerance
      const downGreen = g - tolerance
      const upGreen = g + tolerance
      const downBlue = b - tolerance
      const upBlue = b + tolerance
      const sameRed = downRed < data[i] && data[i] < upRed
      const sameGreen = downGreen < data[i + 1] && data[i + 1] < upGreen
      const sameBlue = downBlue < data[i + 2] && data[i + 2] < upBlue

      if (sameRed && sameGreen && sameBlue) {
        filtered.data[i] = data[i]
        filtered.data[i + 1] = data[i + 1]
        filtered.data[i + 2] = data[i + 2]
      }

      filtered.data[i + 3] = 255
    }

    return filtered
  },

  new () {
    return Object.create(this, {})
  }
}

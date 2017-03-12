'use strict'

const Kanvas = {
  init (canvas) {
    this.canvas = canvas
    this.context = canvas.getContext('2d')
  },

  getImageData () {
    return this.context.getImageData(0, 0, this.canvas.width, this.canvas.height)
  },

  toBlack (imageData, color = {r: 250, g: 250, b: 250}) {
    const { data } = imageData
    const toBlack = new ImageData(imageData.width, imageData.height)

    for (let i = 0; i < data.length - 1; i += 4) {
      const r = data[i]
      const g = data[i + 1]
      const b = data[i + 2]
      const a = data[i + 3]

      const areEqual = this.arePointsEqual({r: r, g: g, b: b}, color, 60)

      toBlack.data[i] = 255
      toBlack.data[i + 1] = 255
      toBlack.data[i + 2] = 255
      toBlack.data[i + 3] = 255

      if (!areEqual) {
        toBlack.data[i] = 0
        toBlack.data[i + 1] = 0
        toBlack.data[i + 2] = 0
        toBlack.data[i + 3] = 255
      }
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

  toRGBMatrix (image) {
    const { data, width } = new ImageData(image.data, image.width, image.height)
    const matrix = []
    let line = []
    let columnCounter = 0

    for (let i = 0; i < data.length - 1; i += 4) {
      line.push({
        r: data[i],
        g: data[i + 1],
        b: data[i + 2],
        a: data[i + 3],
      })

      columnCounter += 4

      if (columnCounter == width * 4) {
        columnCounter = 0
        matrix.push(line)
        line = []
      }
    }

    return matrix
  },

  plotRGBMatrix (matrix) {
    const imageData = new ImageData(matrix[0].length, matrix.length)

    let i = 0

    matrix.forEach((line) => {
      line.forEach(({r, g, b, a}) => {
        imageData.data[i] = r
        imageData.data[i + 1] = g
        imageData.data[i + 2] = b
        imageData.data[i + 3] = a
        i += 4
      })
    })

    this.context.putImageData(imageData, 0, 0)
  },

  plotImageData (imageData) {
    this.context.putImageData(imageData, 0, 0)
  },

  getColor (imageData, rgb, tolerance = 1) {
    const { r, g, b, a } = rgb
    const { data } = imageData
    const filtered = new ImageData(imageData.width, imageData.height)

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

  getEdges (RGBMatrix) {
    const result = []

    RGBMatrix.forEach((line, row) => {
      const resultLine = []

      let lastLeft = line[0]

      line.forEach((current, col) => {
        let lastUp = row == 0 ? RGBMatrix[0][col] : RGBMatrix[row-1][col]

        const areEqualSide = this.arePointsEqual(lastLeft, current, 10)
        const areEqualVertical = this.arePointsEqual(lastUp, current, 10)

        resultLine[col] = {r: 255, g: 255, b: 255, a: 255}

        if (areEqualSide) {
          resultLine[col] = {r: 255, g: 255, b: 255, a: 255}
        }

        if (!areEqualSide) {
          lastLeft = current

          resultLine[col] = {r: 240, g: 0, b: 100, a: 255}
        }

        if (!areEqualVertical) {
          resultLine[col] = {r: 0, g: 0, b: 245, a: 255}
        }
      })

      result.push(resultLine)
    })

    return result
  },

  getMatrixData (RGBMatrix) {
    const points = []

    RGBMatrix.forEach((line, y) => {
      line.forEach(({r, g, b}, x) => {
        if (r != 255 && g != 255 && b != 255) {
          points.push({r, g, b, x, y})
        }
      })
    })

    return points
  },

  arePointsEqual (point1, point2, tolerance) {
    const sameRed = Math.abs(point1.r - point2.r) < tolerance
    const sameGreen = Math.abs(point1.g - point2.g) < tolerance
    const sameBlue = Math.abs(point1.b - point2.b) < tolerance
    const sameAlpha = Math.abs(point1.a - point2.a) < tolerance

    let areEqual = false

    if (sameRed && sameGreen && sameBlue) {
      areEqual = true
    }

    return areEqual
  },

  new () {
    return Object.create(this, {})
  }
}

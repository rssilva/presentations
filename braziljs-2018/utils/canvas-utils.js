class CanvasUtils {
  splitRGB (data) {
    const rgba = {
      red: [],
      green: [],
      blue: [],
      alpha: []
    }

    for (let i = 0; i < data.length - 1; i += 4) {
      rgba.red.push(data[i])
      rgba.green.push(data[i + 1])
      rgba.blue.push(data[i + 2])
      rgba.alpha.push(data[i + 3])
    }

    return rgba
  }

  mountRGB ({red, green, blue, alpha}) {
    const arr = new Uint8ClampedArray(red.length * 4)

    const length = arr.length
    let iterator = 0

    for (let i = 0; i < length - 1; i += 4) {
      arr[i] = red[iterator]
      arr[i + 1] = green[iterator]
      arr[i + 2] = blue[iterator]
      arr[i + 3] = alpha[iterator]

      iterator++
    }

    return arr
  }

  plotArray (signal, plotContext, plotOpacity) {
    const { width, height } = plotContext.canvas

    const imgData = plotContext.getImageData(0, 0, width, height)
    const dataArr = new Uint8ClampedArray(imgData.data.length)
    // plotContext.clearRect(0, 0, width, height)

    for (let i = 0; i < signal.length; i += 4) {
      dataArr[i] = signal[i]
      dataArr[i + 1] = signal[i + 1]
      dataArr[i + 2] = signal[i + 2]
      dataArr[i + 3] = plotOpacity ? signal[i + 3] : 255
    }

    imgData.data.set(dataArr)
    plotContext.putImageData(imgData, 0, 0)
  }

  removeAlpha (data) {
    const arr = []

    for (let i = 0; i < data.length - 1; i += 4) {
      arr.push(data[i])
      arr.push(data[i + 1])
      arr.push(data[i + 2])
    }

    return arr
  }

  toMatrix (data, width) {
    const rows = []

    for (let i = 0; i < data.length - 1; i += 4 * width) {
      const current = []

      for (let k = 0; k < 4 * width; k += 4) {
        current.push({
          r: data[i + k],
          g: data[i + k + 1],
          b: data[i + k + 2]
        })
      }

      rows.push(current)
    }

    return rows
  }

  toMatrixByColumns (data, width, height) {
    const columns = []
    let index

    for (let i = 0; i < data.length - 1; i += 4 * width) {
      index = Math.floor(i / (4 * width))

      if (!columns[index]) {
        columns[index] = []
      }

      for (let k = 0; k < 4 * width; k += 4) {
        columns[index].push({
          r: data[k],
          g: data[k + 1],
          b: data[k + 2]
        })
      }
    }

    return columns
  }

  plotMatrix (matrix, plotContext) {
    const { width, height } = plotContext.canvas
    plotContext.clearRect(0, 0, width, height)
    const imageInfo = plotContext.getImageData(0, 0, width, height)
    const imgData = imageInfo.data
    let counter = 0
    let row

    for (let i = 0; i < matrix.length; i++) {
      row = matrix[i]

      for (let k = 0; k < row.length; k++) {
        counter += 4

        imgData[counter] = row[k].r
        imgData[counter + 1] = row[k].g
        imgData[counter + 2] = row[k].b
        imgData[counter + 3] = 255
      }
    }

    plotContext.putImageData(imageInfo, 0, 0)
  }

  toGrayScale (imageData) {
    const toGrayScale = []
    let luma

    for (let i = 0; i < imageData.length; i += 4) {
      luma = imageData[i] * 0.2126 + imageData[i + 1] * 0.7152 + imageData[i + 2] * 0.0722

      toGrayScale[i] = luma
      toGrayScale[i + 1] = luma
      toGrayScale[i + 2] = luma
      toGrayScale[i + 3] = 255
    }

    return toGrayScale
  }

  drawColumn (imageData, width, column) {
    const step = width * 4

    for (let i = 0; i < imageData.length; i += step) {
      const index = i + column * 4

      imageData[index] = 0
      imageData[index + 1] = 255
      imageData[index + 2] = 0
    }

    return imageData
  }

  mergeMatrix (image1, image2, points) {
    const merged = []
    const height = image1.length

    for (let row = 0; row < image1.length; row++) {
      if (!merged[row]) {
        merged[row] = []
      }

      merged[row] = merged[row].concat(image1[row])

      for (let k = 0; k < image1[row].length; k++) {
        if (row > (height * points[k] / 255)) {
          merged[row][k] = image2[row][k]
        }
      }
    }

    return merged
  }

  parseToAudio (signal) {
    const parsed = []

    signal.forEach((value) => {
      parsed.push((value - 127.5) / 127.5)
    })

    return parsed
  }
}

modules.CanvasUtils = CanvasUtils

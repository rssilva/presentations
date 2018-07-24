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

  plotFiltered (signal, plotContext, plotOpacity) {
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

  parseToAudio (signal) {
    const parsed = []

    signal.forEach((value) => {
      parsed.push((value - 127.5) / 127.5)
    })

    return parsed
  }
}

modules.CanvasUtils = CanvasUtils

class AudioUtils {
  playSignal ({signal = [], audioContext, sampleRate, to, onended}) {
    const signalLength = signal.length
    const node = audioContext.createBufferSource()

    const buffer = audioContext.createBuffer(1, signalLength, sampleRate)

    const data = buffer.getChannelData(0)

    for (let i = 0; i < signalLength; i += 1) {
      data[i] = signal[i]
    }

    node.buffer = buffer

    node.connect(to || audioContext.destination)

    node.start(audioContext.currentTime)

    node.onended = () => {
      if (onended) {
        onended()
      }
    }

    return node
  }

  loadSound (path, audioContext) {
    const request = new XMLHttpRequest()
    request.open('GET', path, true)
    request.responseType = 'arraybuffer'

    const promise = new Promise((resolve, reject) => {
      request.onload = () => {
        audioContext.decodeAudioData(
          request.response,
          (buffer) => resolve(buffer),
          (error) => console.error(error)
        )
      }

      request.onerror = (error) => reject(error)
    })

    request.send()

    return promise
  }
}

modules.AudioUtils = AudioUtils

// const playBuffer = (buffer, audioContext) => {
//   const startTime = audioContext.currentTime
//
//   const source = audioContext.createBufferSource()
//   source.buffer = buffer
//
//   source.connect(audioContext.destination)
//
//   source.start(startTime)
//   source.stop(startTime + 2)
// }

class Convolver {
  constructor ({ audioContext }) {
    this.audioContext = audioContext

    const node = this.audioContext.createConvolver()

    this.node = node
  }

  setBuffer (buffer) {
    this.node.buffer = buffer
  }

  setInput (input) {
    input.connect(this.node)
  }

  loadFile (file) {
    let ajaxRequest = new XMLHttpRequest()
    ajaxRequest.open('GET', file, true)
    ajaxRequest.responseType = 'arraybuffer'

    const promise = new Promise((resolve) => {
      ajaxRequest.onload = () => {
        const audioData = ajaxRequest.response

        this.audioContext.decodeAudioData(audioData, (buffer) => {
          this.node.buffer = buffer
          resolve(buffer)
        }, (e) => console.log(`Error with decoding audio data ${e.err}`))
      }
    }, () => console.log('deu ruim'))

    ajaxRequest.send()

    return promise
  }
}

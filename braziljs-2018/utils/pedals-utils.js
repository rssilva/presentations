class PedalsUtils {
  getUserMedia (cb) {
    if (!navigator.getUserMedia) {
      navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia
    }

    if (navigator.getUserMedia) {
      navigator.getUserMedia({ audio: true }, cb, (e) => console.error(e))
    } else {
      console.log('getUserMedia not supported in this browser.')
    }
  }
}

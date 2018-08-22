(function () {
  let CURRENT_INDEX = 0

  const getControlsTemplate = () => {
    const template = $(
      `<div class="slide-controls">
        <button class="back-button">back</button>
        <button class="next-button">next</button>
      </div>`
    )

    return template
  }

  const goBack = () => {
    const slides = $('.slide')
    let nextIndex = SLIDES_ORDER[--CURRENT_INDEX] // eslint-disable-line

    if (slides[nextIndex] !== undefined) {
      slides.removeClass('current')
      $(slides[nextIndex]).addClass('current')
    } else {
      ++CURRENT_INDEX
    }
  }

  const goNext = () => {
    const slides = $('.slide')
    let nextIndex = SLIDES_ORDER[++CURRENT_INDEX] // eslint-disable-line

    if (slides[nextIndex] !== undefined) {
      slides.removeClass('current')
      $(slides[nextIndex]).addClass('current')
    } else {
      --CURRENT_INDEX
    }
  }

  const bindEvents = () => {
    const controls = $('.slide-controls')

    controls.find('.back-button').on('click', () => {
      goBack()
    })

    controls.find('.next-button').on('click', () => {
      goNext()
    })

    window.addEventListener('keyup', (ev) => {
      const { keyCode } = ev

      if (keyCode == 37) {
        goBack()
      }

      if (keyCode == 39) {
        goNext()
      }
    })
  }

  const init = () => {
    const body = $('body')
    body.append(getControlsTemplate())

    bindEvents()
  }

  init()
})()

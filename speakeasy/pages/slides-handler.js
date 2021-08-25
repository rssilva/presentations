
class SlidesHandler {
  getControlsTemplate() {
    const template = $(
      `<div class="slide-controls">
        <button class="back-button">back</button>
        <button class="next-button">next</button>
      </div>`
    )

    return template
  }

  goBack() {
    const slides = this.body.find('.slide')
    let nextIndex = this.slidesOrder[--this.currentIndex] // eslint-disable-line

    if (slides[nextIndex] !== undefined) {
      slides.removeClass('current')
      $(slides[nextIndex]).addClass('current')
    } else {
      ++this.currentIndex
    }
  }

  goNext() {
    const slides = this.body.find('.slide')
    let nextIndex = this.slidesOrder[++this.currentIndex] // eslint-disable-line

    console.log(this.currentIndex)

    if (slides[nextIndex] !== undefined) {
      slides.removeClass('current')
      $(slides[nextIndex]).addClass('current')
    } else {
      --this.currentIndex
    }
  }

  bindEvents() {
    const controls = $('.slide-controls')

    controls.find('.back-button').on('click', () => {
      this.goBack()
    })

    controls.find('.next-button').on('click', () => {
      this.goNext()
    })

    window.addEventListener('keyup', (ev) => {
      const { keyCode } = ev

      if (keyCode == 37) {
        this.goBack()
      }

      if (keyCode == 39) {
        this.goNext()
      }
    })
  }

  init(selector, currentIndex = 0, slidesOrder = []) {
    const body = selector ? $(selector) : $('body')

    this.currentIndex = currentIndex
    this.slidesOrder = slidesOrder
    this.body = body

    body.append(this.getControlsTemplate())

    this.bindEvents()
  }
}

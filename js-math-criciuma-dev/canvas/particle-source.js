class Particle {
  constructor({ context, lifetime, x, y, speed, start }) {
    this.ctx = context
    this.start = start
    this.lifeTime = lifetime || Math.round(Math.random() * 3000)
    this.x = x || 0
    this.y = y || 0
    this.speed = speed || Math.round(Math.random() * 3)

    this.r = Math.random() * 255
    this.g = Math.random() * 255
    this.b = Math.random() * 255

    this.radius = Math.random() * 10
  }

  draw(currentTime) {
    const timeDiff = currentTime - this.start
    this.x += 2
    this.y -= (0.5 + (timeDiff)/1000 * this.speed)

    const gradient = this.ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, radius);

    const opacity = timeDiff/this.lifeTime

    this.ctx.beginPath()
    gradient.addColorStop(0, "rgba("+this.r+", "+this.g+", "+this.b+", "+opacity+")")
    gradient.addColorStop(0.5, "rgba("+this.r+", "+this.g+", "+this.b+", "+opacity+")")
    gradient.addColorStop(1, "rgba("+this.r+", "+this.g+", "+this.b+", 0)")
    this.ctx.fillStyle = gradient
    this.ctx.arc(this.x, this.y, this.radius, Math.PI*2, false)
    this.ctx.fill()
  }
}

class ParticleSource {
  constructor (context, {x, y}) {
    this.ctx = context
    this.x = x || 0
    this.y = y || 0

    this.t = new Date().getTime()
    this.particles = []
  }

  setPosition(x, y) {
    this.x = x
    this.y = y
  }

  setParticles(quantity = 50) {
    for (let i = 0; i < quantity; i++) {
      const particle = new Particle({
        context: this.ctx,
        start: this.t,
        x: this.x + Math.random() * 10,
        y: this.y + Math.random() * 10,
      })

      this.particles.push(particle)
    }
  }

  drawParticles(t) {
    this.particles = this.particles.map((p) => {
      const timeSinceCreated = t - p.start

      if (timeSinceCreated > p.lifeTime) {
        return new Particle({
          context: this.ctx,
          start: this.t,
          x: this.x + Math.random() * 10,
          y: this.y + Math.random() * 10,
        })
      } else {
        return p
      }
    })

    this.particles.forEach((p) => {
      p.draw(this.t)
    })
  }

  draw() {
    this.t = new Date().getTime()
    this.drawParticles(this.t)
    this.ctx.beginPath()
    this.ctx.fillStyle = 'tomato'
    this.ctx.fillRect(this.x, this.y, 30, 30)
    // this.ctx.arc(this.x, this.y, 20, Math.PI*2, false)
    this.ctx.fill()
  }
}

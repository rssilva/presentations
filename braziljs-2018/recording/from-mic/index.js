const http = require('http')
const fs = require('fs')

let DATA = []

const save = () => {
  const data = DATA.map((val) => Number(val))

  const content = `
    const SAMPLE = ${JSON.stringify(data)}
    module.exports = SAMPLE
  `

  fs.writeFile('sample.js', content, (err) => {
    if (err) {
      console.log(err)
    }
  })
}

http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', ' http://localhost:8080')
  res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.url == '/data') {
    let body = ''

    req.on('data', (chunk) => {
      body += chunk
    })

    req.on('end', () => {
      const splitted = body.split('%2C')
      splitted.shift()

      DATA.push(...splitted)

      console.log(DATA.length)

      res.write('{}')
      res.end()
    })
  } else if (req.url == '/end') {
    save(DATA)
    res.end()
  } else if (req.url == '/clear') {
    DATA = []
    res.end()
  } else {
    res.write('who')
    res.end()
  }
}).listen(3000)

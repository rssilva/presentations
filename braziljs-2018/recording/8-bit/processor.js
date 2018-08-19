const fs = require('fs')
const SAMPLE = require('../from-mic/sample')

const stepDict = [-0.5, -0.2, -0.1, 0, 0.1, 0.2, 0.5]

const roundTo = (num) => {
  let counter = stepDict.length - 1
  let distanceToPrev
  let distanceToNext
  let rounded
  let minor = stepDict[counter]

  while (counter > -1) {
    distanceToPrev = Math.abs(stepDict[counter + 1] - num)
    distanceToNext = Math.abs(stepDict[counter] - num)

    if (distanceToNext < Math.abs(minor)) {
      minor = distanceToNext
      rounded = stepDict[counter]
    }

    if (distanceToPrev < Math.abs(minor)) {
      minor = distanceToPrev
      rounded = stepDict[counter + 1]
    }

    counter--
  }

  return rounded
}

const parsed = SAMPLE.map((value) => roundTo(value))

fs.writeFile('parsed.js', `
  const PARSED = ${JSON.stringify(parsed)}
`, () => {})

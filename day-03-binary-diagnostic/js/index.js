const path = require('path')
const fs = require('fs')

const inputFileName = process.argv[2]
if (!inputFileName) {
  console.log(`ERROR: Expected file name. Run using:\n\tnode ${path.basename(process.argv[1])} <input_file>`)
  return
}

const fileContents = fs.readFileSync(inputFileName, {encoding: 'utf8'})

const lines = parseFile(fileContents.trim().split('\n'))
console.log(`part 1: ${part1(lines)}`)
console.log(`part 2: ${part2(lines)}`)

function parseFile(lines) {
  return lines
}

function part1(lines) {
  const numDigits = lines[0].length
  const numLines = lines.length
  const counts = lines
    .reduce((acc, line) => {
      for (let i = 0; i < line.length; i++) {
        if (line[i] === '1') {
          acc[i] += 1
        }
      }
      return acc
    }, (new Array(numDigits)).fill(0))


  const gamma = counts.reduce((acc, count, i) => {
    if (count > numLines / 2) {
      acc |= 1 << (numDigits - i - 1)
    }

    return acc
  }, 0)
  // Flip gamma and mask it to the correct number of digits
  const epsilon = ~gamma & ((1 << numDigits) - 1)

  return gamma * epsilon
}

function splitFilterAtBit(lines, i) {
  const zero = []
  const one = []

  lines.forEach(line => {
    if (line[i] === '0') {
      zero.push(line)
    } else {
      one.push(line)
    }
  })

  return { zero, one }
}

function part2(lines) {
  const numDigits = lines[0].length

  // Determine majority
  let majority = lines
  for (let i = 0; i < numDigits && majority.length > 1; i++) {
    const { zero, one } = splitFilterAtBit(majority, i)

    majority = one.length >= zero.length ? one : zero
  }
  const oxygenRating = parseInt(majority[0], 2)

  // Determine minority
  let minority = lines
  for (let i = 0; i < numDigits && minority.length > 1; i++) {
    const { zero, one } = splitFilterAtBit(minority, i)

    minority = one.length >= zero.length ? zero : one
  }
  const co2Scrubber = parseInt(minority[0], 2)


  return oxygenRating * co2Scrubber
}

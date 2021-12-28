const path = require('path')
const fs = require('fs')

const inputFileName = process.argv[2]
if (!inputFileName) {
  console.log(`ERROR: Expected file name. Run using:\n\tnode ${path.basename(process.argv[1])} <input_file>`)
  return
}

const fileContents = fs.readFileSync(inputFileName, {encoding: 'utf8'})

const charPoints = {
  ')': 3,
  ']': 57,
  '}': 1197,
  '>': 25137,
  '(': 1,
  '[': 2,
  '{': 3,
  '<': 4
}

const closingForOpening = {
  '(': ')',
  '[': ']',
  '{': '}',
  '<': '>'
}

const lines = parseFile(fileContents.trim().split('\n'))
console.log(`part 1: ${part1(lines)}`)
console.log(`part 2: ${part2(lines)}`)

function parseFile(lines) {
  return lines
}

function corruptLineCost(line) {
  const openingChars = []
  for (let i = 0; i < line.length; i++) {
    const c = line[i]

    switch (c) {
      case '(':
      case '[':
      case '{':
      case '<':
        openingChars.push(c)
        break;
      case ')':
      case ']':
      case '}':
      case '>':
        // If it's not valid, return points
        if (c !== closingForOpening[openingChars.pop()]) {
          return charPoints[c]
        }
        break;
    }
  }

  return 0
}

function completionCost(line) {
  const openingChars = []
  for (let i = 0; i < line.length; i++) {
    const c = line[i]

    switch (c) {
      case '(':
      case '[':
      case '{':
      case '<':
        openingChars.push(c)
        break;
      case ')':
      case ']':
      case '}':
      case '>':
        openingChars.pop()
        break;
    }
  }

  const closingSequence = openingChars
    .reverse()

  const cost =  closingSequence
    .reduce((acc, c) => 5 * acc + charPoints[c], 0)

  return cost
}

function part1(lines) {
  return lines.reduce((acc, line) => {
    return acc + corruptLineCost(line)
  }, 0)
}

function part2(lines) {
  const costs = lines
    .filter(line => corruptLineCost(line) === 0)
    .map(line => completionCost(line))
    .sort((a, b) => a - b)

  return costs[Math.floor(costs.length / 2)]
}

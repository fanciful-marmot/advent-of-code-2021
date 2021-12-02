const path = require('path')
const fs = require('fs')

const inputFileName = process.argv[2]
if (!inputFileName) {
  console.log(`ERROR: Expected file name. Run using:\n\tnode ${path.basename(process.argv[1])} <input_file>`)
  return
}

const fileContents = fs.readFileSync(inputFileName, {encoding: 'utf8'})

// part 1: 1990000
// part 2: 1975421260

const movements = parseFile(fileContents.trim().split('\n'))
console.log(`part 1: ${part1(movements)}`)
console.log(`part 2: ${part2(movements)}`)

function parseFile(lines) {
  return lines.map(line => {
    const parts = line.split(' ')
    const magnitude = parseInt(parts[1], 10)

    switch (parts[0]) {
      case "forward":
        return {x: magnitude, y: 0};
      case "up":
        return {x: 0, y: -magnitude};
      case "down":
        return {x: 0, y: magnitude};
      default:
        throw new Error(`Unknown direction "${parts[0]}"`)
    }
  })
}

function part1(movements) {
  const position = movements
    .reduce((acc, movement) => {
      acc.x += movement.x
      acc.y += movement.y
      return acc
    }, {x: 0, y: 0})

  return position.x * position.y
}

function part2(movements) {
  const position = movements
    .reduce((acc, movement) => {
      acc.x += movement.x
      acc.y += acc.aim * movement.x
      acc.aim += movement.y
      return acc
    }, {x: 0, y: 0, aim: 0})

  return position.x * position.y
}

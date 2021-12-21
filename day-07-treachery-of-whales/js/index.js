const path = require('path')
const fs = require('fs')

const inputFileName = process.argv[2]
if (!inputFileName) {
  console.log(`ERROR: Expected file name. Run using:\n\tnode ${path.basename(process.argv[1])} <input_file>`)
  return
}

const fileContents = fs.readFileSync(inputFileName, {encoding: 'utf8'})

const sortedCrabs = parseFile(fileContents.trim().split('\n'))
console.log(`part 1: ${getMinimumCrabPosition(sortedCrabs, linearFuel)}`)
console.log(`part 2: ${getMinimumCrabPosition(sortedCrabs, nonLinearFuel)}`)

function parseFile(lines) {
  const crabs = lines[0] // Should only be one line
    .split(',')
    .map(Number)
    .sort((a, b) => a - b)

  return crabs
}

function linearFuel(start, end) {
  return Math.abs(start - end)
}

function nonLinearFuel(start, end) {
  const delta = Math.abs(start - end)

  // Cost is the sum of 1 to delta
  return delta * (delta + 1) / 2
}

function getMinimumCrabPosition(crabs, fuelFunction) {
  const maxPosition = crabs[crabs.length - 1] + 1

  // Create a crabs x maxPosition grid
  const grid = (new Array(crabs.length))
    .fill(0)
    .map(() => (new Array(maxPosition)).fill(0))

  // Determine cost of moving crabs to each position
  grid.forEach((row, r) => {
    const initialPosition = crabs[r]
    row.forEach((_, c) => {
      row[c] = fuelFunction(initialPosition, c)
    })
  })

  // Find minimum column cost
  let minFuel = Infinity
  let minPosition = 0
  for (let c = 0; c < maxPosition; c++) {
    let cost = 0
    for (let r = 0; r < crabs.length; r++) {
      cost += grid[r][c]
    }

    if (cost < minFuel) {
      minFuel = cost
      minPosition = c
    }
  }

  return `${minPosition}, ${minFuel}`
}

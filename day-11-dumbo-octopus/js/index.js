const path = require('path')
const fs = require('fs')

const inputFileName = process.argv[2]
if (!inputFileName) {
  console.log(`ERROR: Expected file name. Run using:\n\tnode ${path.basename(process.argv[1])} <input_file>`)
  return
}

const fileContents = fs.readFileSync(inputFileName, {encoding: 'utf8'})

const parsedInput = parseFile(fileContents.trim().split('\n'))
console.log(`part 1: ${part1(parsedInput)}`)
console.log(`part 2: ${part2(parsedInput)}`)

function parseFile(lines) {
  return lines
    .map(line => line.split('').map(Number))
}

function incrementEnergy(r, c, energyMap) {
  if (r < 0 || r >= energyMap.length) {
    return
  }

  const row = energyMap[r]

  if (c < 0 || c >= row.length) {
    return
  }

  row[c] += 1
}

function nextFlash(energyMap, hasFlashed) {
  for (let r = 0; r < energyMap.length; r++) {
    const row = energyMap[r]
    for (let c = 0; c < row.length; c++) {
      if (row[c] > 9 && !hasFlashed.has(`${r},${c}`)) {
        return { r, c }
      }
    }
  }

  return null
}

function tick(energyMap) {
  // Increment all energy by 1
  for (let r = 0; r < energyMap.length; r++) {
    const row = energyMap[r]
    for (let c = 0; c < row.length; c++) {
      row[c] += 1
    }
  }

  // Find coordinates ready to flash that haven't
  const hasFlashed = new Set()
  const coordinatesToClear = []
  let next = nextFlash(energyMap, hasFlashed)
  while (next) {
    hasFlashed.add(`${next.r},${next.c}`)
    coordinatesToClear.push(next)

    for (let r = -1; r <= 1; r++) {
      for (let c = -1; c <= 1; c++) {
        incrementEnergy(next.r + r, next.c + c, energyMap)
      }
    }

    next = nextFlash(energyMap, hasFlashed)
  }

  // Clear flashers
  coordinatesToClear.forEach(({r, c}) => {
    energyMap[r][c] = 0
  })

  return coordinatesToClear.length
}

function part1(energyMap) {
  energyMap = energyMap.map(row => row.slice())
  let flashes = 0
  for (let i = 0; i < 100; i++) {
    flashes += tick(energyMap)
  }

  return flashes
}

function part2(energyMap) {
  energyMap = energyMap.map(row => row.slice())
  let step = 0, flashes = 0
  do {
    step += 1
    flashes = tick(energyMap)
  } while (flashes !== 10 * 10);

  return step
}

const path = require('path')
const fs = require('fs')

const inputFileName = process.argv[2]
if (!inputFileName) {
  console.log(`ERROR: Expected file name. Run using:\n\tnode ${path.basename(process.argv[1])} <input_file>`)
  return
}

const fileContents = fs.readFileSync(inputFileName, {encoding: 'utf8'})

const fish = parseFile(fileContents.trim().split('\n'))
console.log(`part 1: ${fishAfterDays(fish.slice(), 80)}`)
console.log(`part 2: ${fishAfterDays(fish.slice(), 256)}`)

// Returns array indexed by days to spawn and a count how many fish are at each point
function parseFile(lines) {
  return lines[0] // Should only be one line
    .split(',')
    .map(Number)
    .reduce((acc, fish) => {
      acc[fish] += 1
      return acc
    }, (new Array(9)).fill(0))
}

function fishAfterDays(fish, days) {
  for (let i = 0; i < days; i++) {
    const numSpawners = fish[0]
    fish[0] = 0

    // Move fish down by 1
    for (let i = 1; i < fish.length; i++) {
      fish[i - 1] = fish[i]
    }

    // zeroes spawn
    fish[6] += numSpawners
    fish[8] = numSpawners
  }

  return fish.reduce((acc, f) => acc + f, 0)
}

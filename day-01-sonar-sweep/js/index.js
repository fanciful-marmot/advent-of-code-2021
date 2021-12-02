const path = require('path')
const fs = require('fs')

const inputFileName = process.argv[2]
if (!inputFileName) {
  console.log(`ERROR: Expected file name. Run using:\n\tnode ${path.basename(process.argv[1])} <input_file>`)
  return
}

const fileContents = fs.readFileSync(inputFileName, {encoding: 'utf8'})

// Depths is array of numbers
const depths = fileContents
  .trim()
  .split('\n')
  .map(Number)

console.log(`part 1: ${part1(depths)}`)
console.log(`part 2: ${part2(depths)}`)

function part1(depths) {
  return depths
    .reduce((acc, depth) => {
      if (depth > acc.previous) {
        acc.count++
      }

      acc.previous = depth

      return acc
    }, {count: 0, previous: depths[0]}).count
}

function part2(depths) {
  const windowSums = []
  for (let i = 0; i < depths.length - 2; i++) {
    windowSums.push(depths[i] + depths[i + 1] + depths[i + 2])
  }

  return part1(windowSums)
}

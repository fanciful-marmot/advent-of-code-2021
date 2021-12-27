const path = require('path')
const fs = require('fs')

const inputFileName = process.argv[2]
if (!inputFileName) {
  console.log(`ERROR: Expected file name. Run using:\n\tnode ${path.basename(process.argv[1])} <input_file>`)
  return
}

const fileContents = fs.readFileSync(inputFileName, {encoding: 'utf8'})

const heightMap = parseFile(fileContents.trim().split('\n'))
console.log(`part 1: ${part1(heightMap)}`)
console.log(`part 2: ${part2(heightMap)}`)

function parseFile(lines) {
  return lines.map(line => (
    line.split('').map(Number)
  ))
}

function heightAtPoint(r, c, heightMap) {
  if (r < 0 || r >= heightMap.length) {
    return Infinity
  }

  const row = heightMap[r]

  if (c < 0 || c >= row.length) {
    return Infinity
  }

  return row[c]
}

function findLowPoints(heightMap) {
  const minima = []

  for (let r = 0; r < heightMap.length; r++) {
    const row = heightMap[r]
    for (let c = 0; c < row.length; c++) {
      const h = row[c]

      if (
        h < heightAtPoint(r - 1, c, heightMap) &&
        h < heightAtPoint(r + 1, c, heightMap) &&
        h < heightAtPoint(r, c - 1, heightMap) &&
        h < heightAtPoint(r, c + 1, heightMap)
      ) {
        minima.push({r, c})
      }
    }
  }

  return minima
}

// Modifies the height map but oh well ¯\_(ツ)_/¯
function floodFill(start, heightMap) {
  const waveFront = [start]
  let size = 0
  heightMap[start.r][start.c] = 9

  while (waveFront.length > 0) {
    const {r, c} = waveFront.shift()
    size += 1

    if (heightAtPoint(r - 1, c, heightMap) < 9) {
      waveFront.push({r: r - 1, c})
      heightMap[r - 1][c] = 9
    }
    if (heightAtPoint(r + 1, c, heightMap) < 9) {
      waveFront.push({r: r + 1, c})
      heightMap[r + 1][c] = 9
    }
    if (heightAtPoint(r, c - 1, heightMap) < 9) {
      waveFront.push({r, c: c - 1})
      heightMap[r][c - 1] = 9
    }
    if (heightAtPoint(r, c + 1, heightMap) < 9) {
      waveFront.push({r, c: c + 1})
      heightMap[r][c + 1] = 9
    }
  }

  return size
}

function part1(heightMap) {
  const lowPoints = findLowPoints(heightMap)

  return lowPoints.reduce((acc, p) => acc + heightMap[p.r][p.c], 0) + lowPoints.length
}

function part2(heightMap) {
  const lowPoints = findLowPoints(heightMap)

  const basinSizes = lowPoints
    .map(start => floodFill(start, heightMap))
    .sort((a, b) => b - a)

  return basinSizes[0] * basinSizes[1] * basinSizes[2]
}

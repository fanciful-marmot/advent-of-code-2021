const path = require('path')
const fs = require('fs')

const inputFileName = process.argv[2]
if (!inputFileName) {
  console.log(`ERROR: Expected file name. Run using:\n\tnode ${path.basename(process.argv[1])} <input_file>`)
  return
}

const fileContents = fs.readFileSync(inputFileName, {encoding: 'utf8'})

const { coordinates, max } = parseFile(fileContents.trim().split('\n'))
const orthogonalOnly = coordinates.filter(({start, end}) => start.x === end.x || start.y === end.y)
console.log(`part 1: ${numIntersections(orthogonalOnly, max)}`)
console.log(`part 2: ${numIntersections(coordinates, max)}`)

// Returns a list of lines defined by start and end points
// Each point has x and y coordinates
function parseFile(lines) {
  const max = {x: 0, y: 0}
  const coordinates = lines.map(line => {
    const [start, end] = line
      .split(' -> ')
      .map(coord => coord.split(',').map(Number))
      .map(([x, y]) => ({x, y}))

    max.x = Math.max(max.x, start.x, end.x)
    max.y = Math.max(max.y, start.y, end.y)

    return {start, end}
  })

  return { coordinates, max }
}

// Draws a line into a grid tallying intersections
function drawLine(grid, {start, end}) {
  const deltaX = Math.abs(end.x - start.x)
  const deltaY = Math.abs(end.y - start.y)
  const length = deltaX === deltaY ? deltaX : Math.max(deltaX, deltaY)

  const stepX = (end.x - start.x) / length
  const stepY = (end.y - start.y) / length

  const p = {...start}

  while(p.x !== end.x || p.y !== end.y) {
    grid[p.y][p.x] += 1
    p.x += stepX
    p.y += stepY
  }

  grid[p.y][p.x] += 1 // Fill the end point too
}

// Returns the number of overlapping cells for the given lines
function numIntersections(coordinates, max) {
  // Grid of intersection counts
  const grid = (new Array(max.y + 1)).fill(0).map(r => (new Array(max.x + 1)).fill(0))

  // Draw lines
  coordinates.forEach(({start, end}) => {
    drawLine(grid, {start, end})
  })

  // Count cells > 1
  const numIntersections = grid.reduce((acc, row) => acc + row.reduce((acc2, cell) => acc2 + (cell > 1 ? 1 : 0), 0), 0)

  return numIntersections
}

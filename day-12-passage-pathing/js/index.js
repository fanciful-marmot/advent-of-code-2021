const path = require('path')
const fs = require('fs')

class Node {
  constructor(name) {
    this.name = name
    this.neighbours = []
    this._visitCount = 0 // 0=never seen, 1=processing, 2=processed
    this.isCave = name[0].toUpperCase() === name[0]
    this.isStart = name === 'start'
    this.isEnd = name === 'end'
  }

  addNeighbour(node) {
    this.neighbours.push(node)
  }

  set visitCount(s) {
    if (!this.isCave) {
      this._visitCount = s
    }
  }

  get visitCount() {
    return this._visitCount
  }
}

class Graph {
  constructor() {
    this.nameToNode = new Map()
    this.start = null
  }

  _getOrCreateNode(name) {
    if (this.nameToNode.has(name)) {
      return this.nameToNode.get(name)
    }

    const node = new Node(name)
    this.nameToNode.set(name, node)
    if (node.isStart) {
      this.start = node
    }

    return node
  }

  addConnection(name1, name2) {
    const node1 = this._getOrCreateNode(name1)
    const node2 = this._getOrCreateNode(name2)

    node1.addNeighbour(node2)
    node2.addNeighbour(node1)
  }

  countPaths() {
    const _pathsFromNode = node => {
      if (node.isEnd) {
        return 1
      }

      if (node.visitCount > 0) {
        return 0
      }

      node.visitCount = 1
      const paths = node.neighbours.reduce((acc, node) => acc + _pathsFromNode(node), 0)
      node.visitCount = 0

      return paths
    }

    return _pathsFromNode(this.start)
  }

  countPathsWithDoubling() {
    const _pathsFromNode = (node, hasDoubleVisited) => {
      if (node.isEnd) {
        return 1
      }
      if (node.visitCount > 0 && node.isStart) {
        return 0
      }

      if (node.visitCount > 0 && hasDoubleVisited) {
        return 0
      }

      hasDoubleVisited = hasDoubleVisited || node.visitCount > 0

      node.visitCount++
      const paths = node.neighbours.reduce((acc, node) => acc + _pathsFromNode(node, hasDoubleVisited), 0)
      node.visitCount--

      return paths
    }

    return _pathsFromNode(this.start, false)
  }
}

function parseFile(lines) {
  return lines
    .reduce((graph, line) => {
      const [name1, name2] = line.split('-')
      graph.addConnection(name1, name2)
      return graph
    }, new Graph())
}

function part1(graph) {
  return graph.countPaths()
}

function part2(graph) {
  return graph.countPathsWithDoubling()
}

{
  const inputFileName = process.argv[2]
  if (!inputFileName) {
    console.log(`ERROR: Expected file name. Run using:\n\tnode ${path.basename(process.argv[1])} <input_file>`)
    return
  }

  const fileContents = fs.readFileSync(inputFileName, {encoding: 'utf8'})

  const parsedInput = parseFile(fileContents.trim().split('\n'))
  console.log(`part 1: ${part1(parsedInput)}`)
  console.log(`part 2: ${part2(parsedInput)}`)
}

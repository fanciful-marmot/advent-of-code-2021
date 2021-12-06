const path = require('path')
const fs = require('fs')

const inputFileName = process.argv[2]
if (!inputFileName) {
  console.log(`ERROR: Expected file name. Run using:\n\tnode ${path.basename(process.argv[1])} <input_file>`)
  return
}

const fileContents = fs.readFileSync(inputFileName, {encoding: 'utf8'})

const bingo = parseFile(fileContents.trim().split('\n'))
console.log(`part 1: ${part1(bingo)}`)
console.log(`part 2: ${part2(bingo)}`)

function parseFile(lines) {
  const numberCalls = lines[0].split(',').map(Number)
  const numBoards = (lines.length - 1) / 6

  const boards = []
  for (let i = 0; i < numBoards; i++) {
    const startIndex = i * 6 + 2
    const boardLines = lines.slice(startIndex, startIndex + 5)

    const board = boardLines
      .map(boardLine =>
        boardLine.split(' ')
          .filter(cell => !!cell) // Filter out the '' from the double spaces
          .map(number => ({
            number: parseInt(number.trim(), 10),
            marked: false
          }))
      )

    boards.push(board)
  }

  return {
    numberCalls,
    boards
  }
}

function markBoard(board, number) {
  board.forEach(line => {
    line.forEach(cell => {
      if (cell.number === number) {
        cell.marked = true
      }
    })
  })
}

function hasWon(board) {
  const numRows = board.length
  const numColumns = board[0].length
  // Check rows
  for (let r = 0; r < numRows; r++) {
    if (board[r].every(cell => cell.marked)) {
      return true
    }
  }

  // Check columns
  for (let c = 0; c < numColumns; c++) {
    let won = true
    for (let r = 0; r < numRows && won; r++) {
      if (!board[r][c].marked) {
        won = false
      }
    }

    if (won) {
      return true
    }
  }

  return false
}

function encodeAnswer(board, winningNumber) {
  const unmarkedSum = board.reduce((acc, row) => {
    return acc + row.reduce((acc2, cell) => {
      return acc2 + (cell.marked ? 0 : cell.number)
    }, 0)
  }, 0)

  return unmarkedSum * winningNumber
}

function part1(bingo) {
  const { numberCalls, boards } = bingo

  let i = 0
  let winningBoard
  for (; i < numberCalls.length && !winningBoard; i++) {
    const n = numberCalls[i]

    // Mark all boards
    boards.forEach(board => {
      markBoard(board, n)
    })

    // Find winning board (if it exists)
    winningBoard = boards.find(hasWon)
  }

  return encodeAnswer(winningBoard, numberCalls[i - 1])
}

function part2() {

}

const path = require('path')
const fs = require('fs')

const inputFileName = process.argv[2]
if (!inputFileName) {
  console.log(`ERROR: Expected file name. Run using:\n\tnode ${path.basename(process.argv[1])} <input_file>`)
  return
}

const fileContents = fs.readFileSync(inputFileName, {encoding: 'utf8'})

// Look up table mapping a standard display to numbers
const digitLUT = {
  'abcefg': 0,
  'cf': 1,
  'acdeg': 2,
  'acdfg': 3,
  'bcdf': 4,
  'abdfg': 5,
  'abdefg': 6,
  'acf': 7,
  'abcdefg': 8,
  'abcdfg': 9
}

const entries = parseFile(fileContents.trim().split('\n'))
console.log(`part 1: ${part1(entries)}`)
console.log(`part 2: ${part2(entries)}`)

// Normalizes an encoding to an array sorted by length
function normalize(encoding) {
  return encoding
    .split(' ')
    .map(code => {
      return code.split('').sort().join('')
    })
    .sort((a, b) => a.length - b.length)
}

function parseFile(lines) {
  const entries = lines
    .map(line => {
      const [encoding, display] = line.split('|').map(a => a.trim())

      return {
        encoding: normalize(encoding),
        display: display.split(' ').map(code => code.split('').sort().join(''))
      }
    })

  return entries
}

// Returns a decoder mapping characters back to the standard display characters
function getDecoder(entry) {
  const decoder = new Map()

  const { encoding, display } = entry

  const frequencies = encoding.reduce((acc, enc) => {
    enc.split('')
      .forEach(c => {
        acc.set(c, (acc.get(c) ?? 0) + 1)
      })

    return acc
  }, new Map())

  const numberToEncoding = new Map()
  numberToEncoding.set(1, encoding[0])
  numberToEncoding.set(4, encoding[3])
  numberToEncoding.set(7, encoding[1])
  numberToEncoding.set(8, encoding[9])

  // Determine mapping for 'a'
  const one = numberToEncoding.get(1)
  const seven = numberToEncoding.get(7)
  const aEnc = seven.replace(one[0], '').replace(one[1], '')
  decoder.set(aEnc, 'a')

  // Frequencies of each character in the standard display
  // a: 8, b: 6, c: 8, d: 7, e: 4, f: 9, g: 7
  // Unique frequencies since we can easily determine 'a'
  // b: 6, c: 8, e: 4, f: 9
  const dgOptions = []
  for (const [c, f] of frequencies.entries()) {
    switch (f) {
      case 4:
        decoder.set(c, 'e')
        break;
      case 6:
        decoder.set(c, 'b')
        break;
      case 8:
        if (c !== aEnc) {
          decoder.set(c, 'c')
        }
        break;
      case 7:
        dgOptions.push(c)
        break;
      case 9:
        decoder.set(c, 'f')
        break;
    }
  }

  // Still missing mappings for d and g. Use the encoding of 4 to work it out
  // 4 only has 'd' and is missing 'g'
  const four = numberToEncoding.get(4)
  if (four.includes(dgOptions[0])) { // [0] must be 'd'
    decoder.set(dgOptions[0], 'd')
    decoder.set(dgOptions[1], 'g')
  } else {
    decoder.set(dgOptions[1], 'd')
    decoder.set(dgOptions[0], 'g')
  }

  // Should have a complete decoder now
  if (decoder.size !== 7) {
    throw new Error(`Expected 7 keys, got ${decoder.size}`)
  }

  return decoder
}

// Uses a decoder to decode a given display
function decodeDisplay(display, decoder) {
  const digits = display
    .map(segment => {
      const decoded = segment
        .split('')
        .map(c => decoder.get(c))
        .sort()
        .join('')

      const digit = digitLUT[decoded]

      if (digit == null) {
        throw new Error(`Unknown digit ${digitLUT}`)
      }

      return digit
    })

  return parseInt(digits.join(''), 10)
}

function part1(entries) {
  return entries.reduce((acc, entry) => {
    const { encoding, display } = entry

    // Count just the 1's, 4's, and 7's
    const mapping = new Map() // Maps segment string to the actual number

    // The following is always true due to their unique lengths and them being sorted
    mapping.set(encoding[0], 1)
    mapping.set(encoding[1], 7)
    mapping.set(encoding[2], 4)
    mapping.set(encoding[9], 8)

    // Count occurrences of 1/4/7/8
    return acc + display.reduce((acc2, segments) => {
      return acc2 + (mapping.has(segments) ? 1 : 0)
    }, 0)
  }, 0)
}

function part2(entries) {
  return entries.reduce((acc, entry) => {
    const { encoding, display } = entry

    const decoder = getDecoder(entry)
    const number = decodeDisplay(display, decoder)

    return acc + number
  }, 0)
}

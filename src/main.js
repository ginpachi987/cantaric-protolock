import './style.css'
import * as p5 from '../node_modules/p5/lib/p5'

const sketch = window

let maxCellSize = 65
let cellSize
let fieldDimension = 10
let circleSize = 30
let field = []
let fieldSize
let maxFieldSize = 600

sketch.setup = () => {
  createCanvas(windowWidth, windowHeight)

  newField()

  let resetB = document.querySelector('#reset')
  resetB.addEventListener('click', resetter)
  resetB.addEventListener('touchstart', resetter)

  let newGame = document.querySelector('#new')
  newGame.addEventListener('click', newField)
  newGame.addEventListener('touchstart', newField)

  noLoop()
}

sketch.draw = () => {
  fieldSize = Math.min(maxFieldSize, windowWidth, windowHeight) - 20
  cellSize = fieldSize / (fieldDimension + 1)
  circleSize = cellSize / 1.8

  clear()
  background(40)
  translate((windowWidth - fieldSize) / 2, (windowHeight - fieldSize) / 2)
  push()
  translate(cellSize / 2, cellSize / 2)
  for (let i = 0; i < fieldDimension; i++) {
    circle(0, i * cellSize, circleSize)
  }
  translate(cellSize, cellSize * fieldDimension)
  for (let i = 0; i < fieldDimension; i++) {
    circle(i * cellSize, 0, circleSize)
  }
  pop()
  translate(cellSize, 0)
  for (let i = 0; i < fieldDimension; i++) {
    for (let j = 0; j < fieldDimension; j++) {
      fill(field[i][j] ? 250 : 114)
      stroke(0)
      strokeWeight(1)

      rect(i * cellSize, j * cellSize, cellSize, cellSize)
    }
  }
  fill(255)
}

sketch.windowResized = () => {
  resizeCanvas(windowWidth, windowHeight);
  redraw()
}

sketch.mouseClicked = () => {
  let mX = mouseX - (windowWidth - fieldSize) / 2
  let mY = mouseY - (windowHeight - fieldSize) / 2

  if (mX < 0 || mX > fieldSize || mY < 0 || mY > fieldSize) return

  let x = Math.floor(mX / cellSize)
  let y = Math.floor(mY / cellSize)

  if (x > 0 && y < fieldDimension || (x == 0 && y == fieldDimension)) return

  if (x === 0) {
    for (let i = 0; i < fieldDimension; i++) {
      field[i][y] = !field[i][y]
    }
  }
  else if (y === fieldDimension) {
    x--
    for (let i = 0; i < fieldDimension; i++) {
      field[x][i] = !field[x][i]
    }
  }

  resetMatrix()
  redraw()
  winCheck()
}

function newField() {
  field = [...Array(fieldDimension)].map(() => [...Array(fieldDimension).keys()].map(() => false))

  let rand = Math.random() < .5

  let rands = getRandoms(rand ? 4 : 3)

  for (let i = 0; i < (rand ? 4 : 3); i++) {
    for (let j = 0; j < fieldDimension; j++) {
      field[rands[i]][j] = !field[rands[i]][j]
    }
  }

  rands = getRandoms(!rand ? 4 : 3)

  for (let i = 0; i < (!rand ? 4 : 3); i++) {
    for (let j = 0; j < fieldDimension; j++) {
      field[j][rands[i]] = !field[j][rands[i]]
    }
  }

  redraw()
}

function getRandoms(number) {
  //console.log(number)
  let arr = []
  while (arr.length < number) {
    let el = ~~(Math.random() * fieldDimension)
    if (arr.indexOf(el) === -1) arr.push(el)
  }
  //console.log(arr)
  return arr
}

function winCheck() {
  let notYet = false
  for (let i = 0; i < fieldDimension; i++) {
    for (let j = 0; j < fieldDimension; j++) {
      if (field[i][j] == true) {
        notYet = true
        break
      }
    }
    if (notYet) break
  }

  if (!notYet) {
    alert('Yay!')
    setTimeout(() => {
      newField()
    }, 1000)
  }
}

function resetter() {

}
/// <reference types="../node_modules/@types/p5/global" />

import './style.css'
import * as p5 from '../node_modules/p5/lib/p5'

import offImage from './img/off.png'
import onImage from './img/on.png'

const sketch = window

let cellSize
let fieldDimension = 10
let circleSize = 30
let field
let fieldSize
let maxFieldSize = 600

let selectedContoller, cX, cY

let off, on

let container

sketch.preload = () => {
  off = loadImage(offImage)
  on = loadImage(onImage)
}

sketch.setup = () => {
  container = document.querySelector('main')
  recalcSizes()
  createCanvas(fieldSize, fieldSize)

  rectMode(CENTER)
  imageMode(CENTER)
  textAlign(CENTER)

  // let resetB = document.querySelector('#reset')
  // resetB.addEventListener('click', resetter)
  // resetB.addEventListener('touchstart', resetter)

  let newGame = document.querySelector('#new')
  newGame.addEventListener('click', newField)
  newGame.addEventListener('touchstart', newField)

  field = new Field(fieldDimension)
  field.newField()
}

sketch.draw = () => {
  background(41)
  push()
  translate(cellSize / 2, cellSize / 2)
  field.draw()
  pop()
}

sketch.windowResized = () => {
  recalcSizes()
  resizeCanvas(fieldSize, fieldSize);
  //redraw()
}

sketch.mouseMoved = () => {
  let mX = mouseX //- (windowWidth - fieldSize) / 2
  let mY = mouseY //- (windowHeight - fieldSize) / 2

  if (mX < 0 || mX > fieldSize || mY < 0 || mY > fieldSize) {
    selectedContoller = null
    // container.style.cursor = 'default'
    return
  }

  cX = Math.floor(mX / cellSize)
  cY = Math.floor(mY / cellSize)


  if (cX > 0 && cY < fieldDimension || (cX == 0 && cY == fieldDimension))
    selectedContoller = null
  else {
    if (cX === 0) {
      selectedContoller = field.leftSwitches[cY]
    }
    else {
      selectedContoller = field.bottomSwitches[cX - 1]
    }
    // container.style.cursor = 'pointer'
  }
}

sketch.mouseClicked = () => {
  if (!selectedContoller) return

  if (cX === 0) {
    for (let i = 0; i < fieldDimension; i++) {
      setTimeout((x, y) => {
        field.cells[x][y].state = !field.cells[x][y].state
      }, i * 50, i, cY)
    }
  }
  else {
    for (let i = 0; i < fieldDimension; i++) {
      setTimeout((x, y) => {
        field.cells[x][y].state = !field.cells[x][y].state
      }, (fieldDimension - 1 - i) * 50, cX - 1, i)
    }
  }

  winCheck()
}

function recalcSizes() {
  fieldSize = Math.min(maxFieldSize, windowWidth, windowHeight) - 60
  cellSize = fieldSize / (fieldDimension + 1)
  circleSize = cellSize / 1.8

  container.style.top = (windowHeight - fieldSize) / 2 + 'px'
  container.style.left = (windowWidth - fieldSize) / 2 + 'px'
}

function newField() {
  if (field) field.newField()
}

function winCheck() {
  let notYet = false
  for (let i = 0; i < fieldDimension; i++) {
    for (let j = 0; j < fieldDimension; j++) {
      if (field.cells[i][j].state == true) {
        notYet = true
        break
      }
    }
    if (notYet) break
  }

  if (!notYet) {
    setTimeout(() => {
      alert('Yay!')
      field.newField()
    }, 1000)
  }
}

// function resetter() {}

class Cell {
  constructor(state = false) {
    this.state = state
    this.opacity = state ? 255 : 0
  }

  draw(x, y) {
    if (this.state && this.opacity < 255) {
      this.opacity += 85
    }
    else if (!this.state && this.opacity > 0) {
      this.opacity -= 85
    }
    push()
    image(off, x * cellSize, y * cellSize, cellSize, cellSize)
    tint(255, this.opacity)
    image(on, x * cellSize, y * cellSize, cellSize, cellSize)
    pop()
  }
}

class Switch {
  constructor(x, y) {
    this.x = x
    this.y = y
  }

  draw(angle) {
    const runes = ['🜈', '🜘', '🝑', '🝠', '🜋', '🝓']

    push()
    translate(this.x * cellSize, this.y * cellSize)
    stroke('#EAD5C2')
    strokeWeight(1.5)
    noFill()
    circle(0, 0, circleSize)
    circle(0, 0, circleSize / 2)

    rotate(angle)
    fill(255)

    push()
    textSize(circleSize / 10)
    strokeWeight(2)
    rotate(angle)
    for (let i = 0; i < 6; i++) {
      text(runes[i], 0, circleSize / 2.5)
      rotate(PI / 3)
    }
    pop()

    if (this == selectedContoller) {
      fill('#EAD5C264')
      tint(255, 128)
      circle(0, 0, circleSize)
    }
    pop()
  }
}

class Field {
  constructor(size) {
    this.cells = [...Array(size)].map(() => [...Array(size).keys()].map(() => new Cell()))
    this.controlAngle = 0
    this.leftSwitches = [...Array(size).keys()].map((_, i) => new Switch(0, i))
    this.bottomSwitches = [...Array(size).keys()].map((_, i) => new Switch((i + 1), size))

    this.display = false
    this.transparency = 0
  }

  newField() {
    let rand = Math.random() < .5
    let rands = this.getRandomNumbers(rand ? 4 : 3)
    for (let i = 0; i < (rand ? 4 : 3); i++) {
      for (let j = 0; j < fieldDimension; j++) {
        this.cells[rands[i]][j].state = !this.cells[rands[i]][j].state
      }
    }
    rands = this.getRandomNumbers(!rand ? 4 : 3)
    for (let i = 0; i < (!rand ? 4 : 3); i++) {
      for (let j = 0; j < fieldDimension; j++) {
        this.cells[j][rands[i]].state = !this.cells[j][rands[i]].state
      }
    }
  }

  getRandomNumbers(amount) {
    let arr = []
    while (arr.length < amount) {
      let el = floor(Math.random() * fieldDimension)
      if (arr.indexOf(el) === -1) arr.push(el)
    }
    return arr
  }

  draw() {
    this.cells.forEach((row, i) => {
      row.forEach((cell, j) => {
        cell.draw((i + 1), j)
      })
    })
    this.bottomSwitches.forEach((control, i) => {
      control.draw(this.controlAngle)
    })
    this.leftSwitches.forEach((control, i) => {
      control.draw(this.controlAngle)
    })
    this.controlAngle -= .01
    if (this.controlAngle < -PI * 2) this.controlAngle = 0
  }
}
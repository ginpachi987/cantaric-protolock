import './style.css'

import offImage from './img/off.png'
import onImage from './img/on.png'
import switchImage from './img/switch.png'

class Cell {
  constructor(state = false) {
    this.state = state
    this.el = document.createElement('div')
    this.el.classList.add('cell')
    this.el.style.backgroundImage = `url('${offImage}')`
  }

  toggleState(state) {
    this.state = state || !this.state
    this.el.style.backgroundImage = `url('${this.state ? onImage : offImage}')`
  }
}

class Switch {
  constructor(field, x, y) {
    this.field = field
    this.el = document.createElement('div')
    this.el.classList.add('switch')
    if (x != null || y != null) {
      this.image = document.createElement('img')
      this.image.classList.add('switch-image')
      this.image.src = switchImage

      this.image.addEventListener('click', () => {
        field.toggleCells(x, y)
      })
      this.el.appendChild(this.image)
    }
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
    this.leftSwitches = [...Array(size).keys()].map((_, i) => new Switch(this, i, null))
    this.bottomSwitches = [new Switch(this, null, null)].concat([...Array(size).keys()].map((_, i) => new Switch(this, null, i)))

    for (let i = 0; i <= size; i++) {
      let row = document.createElement('div')
      row.classList.add('row')
      if (i < size) {
        row.appendChild(this.leftSwitches[i].el)
        for (let j = 0; j < size; j++) {
          row.appendChild(this.cells[i][j].el)
        }
      }
      else {
        for (let j = 0; j <= size; j++) {
          row.appendChild(this.bottomSwitches[j].el)
        }
      }

      container.appendChild(row)
    }
  }

  toggleCells(row, col) {
    if (row == null) {
      for (let i = 0; i < fieldDimension; i++) {
        setTimeout((x, y) => {
          field.cells[x][y].toggleState()
        }, (fieldDimension - 1 - i) * 50, i, col)
      }
    }
    else {
      for (let i = 0; i < fieldDimension; i++) {
        setTimeout((x, y) => {
          field.cells[x][y].toggleState()
        }, i * 50, row, i)
      }
    }

    setTimeout(() => {
      winCheck()
    }, fieldDimension * 50)

  }

  newField() {
    let rand = Math.random() < .5
    let rands = this.getRandomNumbers(rand ? 4 : 3)
    for (let i = 0; i < (rand ? 4 : 3); i++) {
      for (let j = 0; j < fieldDimension; j++) {
        this.cells[rands[i]][j].toggleState()
      }
    }
    rands = this.getRandomNumbers(!rand ? 4 : 3)
    for (let i = 0; i < (!rand ? 4 : 3); i++) {
      for (let j = 0; j < fieldDimension; j++) {
        this.cells[j][rands[i]].toggleState()
      }
    }
  }

  getRandomNumbers(amount) {
    let arr = []
    while (arr.length < amount) {
      let el = Math.floor(Math.random() * fieldDimension)
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

  setSize(size) {
    this.cells.forEach((row, i) => {
      row.forEach((cell, j) => {
        cell.el.style.width = `${size}px`
        cell.el.style.height = `${size}px`
        cell.el.style.backgroundSize = `${size}px`
      })
    })
    this.bottomSwitches.forEach((control, i) => {
      control.el.style.width = `${size}px`
      control.el.style.height = `${size}px`
    })
    this.leftSwitches.forEach((control, i) => {
      control.el.style.width = `${size}px`
      control.el.style.height = `${size}px`
    })
  }
}

// let cellSize
let fieldDimension = 10
let circleSize = 30
let field
let fieldSize
let maxFieldSize = 600

let selectedContoller, cX, cY

let off, on

let container

setup()

function setup() {
  container = document.querySelector('#game')

  // let resetB = document.querySelector('#reset')
  // resetB.addEventListener('click', resetter)
  // resetB.addEventListener('touchstart', resetter)

  let newGame = document.querySelector('#new')
  newGame.addEventListener('click', newField)
  newGame.addEventListener('touchstart', newField)

  field = new Field(fieldDimension)
  field.newField()

  window.addEventListener('resize', recalcSizes)

  recalcSizes()
}

function recalcSizes() {
  fieldSize = Math.min(maxFieldSize, window.innerWidth, window.innerHeight) - 60
  let cellSize = fieldSize / (fieldDimension + 1)
  // circleSize = cellSize / 1.8

  container.style.width = `${fieldSize}px`

  if (field) field.setSize(cellSize)
  //container.style.height = `${fieldSize}px`
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
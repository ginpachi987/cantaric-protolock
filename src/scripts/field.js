import { Cell } from './cell'
import { Switch } from './switch'

export class Field {
  constructor(container, size = 10) {
    this.container = container
    this.size = size
    this.cells = [...Array(size)].map(() => [...Array(size).keys()].map(() => new Cell()))
    this.leftSwitches = [...Array(size).keys()].map((_, i) => new Switch(this, i, null))
    this.bottomSwitches = [new Switch(this, null, null)].concat([...Array(size).keys()].map((_, i) => new Switch(this, null, i)))

    for (let i = 0; i <= size; i++) {
      const row = document.createElement('div')
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

  toggleCells(row, col, delay = 50) {
    if (row == null) {
      for (let i = 0; i < this.size; i++) {
        setTimeout((x, y) => {
          this.cells[x][y].toggleState()
        }, (this.size - 1 - i) * delay, i, col)
      }
    }
    else {
      for (let i = 0; i < this.size; i++) {
        setTimeout((x, y) => {
          this.cells[x][y].toggleState()
        }, i * delay, row, i)
      }
    }
  }

  mouseClick(row, col) {
    this.toggleCells(row, col)

    setTimeout(() => {
      this.winCheck()
    }, this.size * 50)
  }

  reset() {
    this.cells.forEach((row) => {
      row.forEach((cell) => {
        cell.toggleState(false)
      })
    })
  }

  newField() {
    this.reset()

    const rand = Math.random() < .5
    let rands = this.getRandomNumbers(rand ? 4 : 3)
    for (let i = 0; i < (rand ? 4 : 3); i++) {
      this.toggleCells(rands[i], null, 0)
    }
    rands = this.getRandomNumbers(!rand ? 4 : 3)
    for (let i = 0; i < (!rand ? 4 : 3); i++) {
      this.toggleCells(null, rands[i], 0)
    }
  }

  getRandomNumbers(amount) {
    const arr = []
    while (arr.length < amount) {
      const el = Math.floor(Math.random() * this.size)
      if (arr.indexOf(el) === -1) arr.push(el)
    }
    return arr
  }

  setSize(size) {
    this.cells.forEach(row => {
      row.forEach(cell => {
        cell.el.style.width = `${size}px`
        cell.el.style.height = `${size}px`
        cell.el.style.backgroundSize = `${size}px`
      })
    })
    this.bottomSwitches.forEach(control => {
      control.el.style.width = `${size}px`
      control.el.style.height = `${size}px`
    })
    this.leftSwitches.forEach(control => {
      control.el.style.width = `${size}px`
      control.el.style.height = `${size}px`
    })
  }

  winCheck() {
    let win = true
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (this.cells[i][j].state == true) {
          win = false
          break
        }
      }
      if (!win) break
    }

    if (win) {
      this.container.style.pointerEvents = 'none'
      this.flicker()

      setTimeout(() => {
        this.newField()
        this.container.style.pointerEvents = 'auto'

        window.top.postMessage("registerWin", '*')
      }, this.size * 250)
    }
  }

  flicker() {
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j <= i; j++) {
        setTimeout((x, y) => {
          this.cells[x][y].toggleState()
          if (x != y) this.cells[y][x].toggleState()
        }, (i + 1) * 100, i, j)

        setTimeout((x, y) => {
          this.cells[x][y].toggleState()
          if (x != y) this.cells[y][x].toggleState()
        }, (i + 1) * 100 + this.size * 100, i, j)
      }
    }
  }
}
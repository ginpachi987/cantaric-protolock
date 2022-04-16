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
    this.state = state == undefined?!this.state:state
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

export class Field {
  constructor(size, container) {
    this.size = size
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

    setTimeout(() => {
      this.winCheck()
    }, this.size * delay)

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

    let rand = Math.random() < .5
    let rands = this.getRandomNumbers(rand ? 4 : 3)
    console.log(rands)
    for (let i = 0; i < (rand ? 4 : 3); i++) {
      this.toggleCells(rands[i], null, 0)
      // for (let j = 0; j < this.size; j++) {
      //   this.cells[rands[i]][j].toggleState()
      // }
    }
    rands = this.getRandomNumbers(!rand ? 4 : 3)
    console.log(rands)
    for (let i = 0; i < (!rand ? 4 : 3); i++) {
      this.toggleCells(null, rands[i], 0)
      // for (let j = 0; j < this.size; j++) {
      //   this.cells[j][rands[i]].toggleState()
      // }
    }
  }

  getRandomNumbers(amount) {
    let arr = []
    while (arr.length < amount) {
      let el = Math.floor(Math.random() * this.size)
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

  winCheck() {
    let notYet = false
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (this.cells[i][j].state == true) {
          notYet = true
          break
        }
      }
      if (notYet) break
    }
  
    if (!notYet) {
      setTimeout(() => {
        alert('Yay!')
        this.newField()

        window.top.postMessage({type: 'message', data: 'win'}, '*')
      }, 1000)
    }
  }
}
import { onImage, offImage } from './images'

export class Cell {
  constructor(state = false) {
    this.state = state
    this.el = document.createElement('div')
    this.el.classList.add('cell')
    this.el.style.backgroundImage = `url('${offImage}')`
  }

  toggleState(state) {
    this.state = state == undefined ? !this.state : state
    this.el.style.backgroundImage = `url('${this.state ? onImage : offImage}')`
  }
}
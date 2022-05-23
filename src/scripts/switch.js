import { switchImage } from './images'

export class Switch {
  constructor(field, x, y) {
    this.field = field
    this.el = document.createElement('div')
    this.el.classList.add('switch')
    if (x != null || y != null) {
      this.image = document.createElement('img')
      this.image.classList.add('switch-image')
      this.image.src = switchImage

      this.image.addEventListener('click', () => {
        field.mouseClick(x, y)
      })
      this.el.appendChild(this.image)
    }
  }

  highlight() {
    this.image.classList.toggle('switch-highlight')
  }
}
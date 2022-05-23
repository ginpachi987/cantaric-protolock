import { langs } from '../lang/langs'
import { onImage, offImage } from './images'
import { Field } from './field'

let tutorialInterval

export function showTutorial(showTip, lang) {
  if (!showTip) {
    localStorage.setItem('showTip', true)
    tip.style.opacity = 0
  }

  const wrapper = document.querySelector('#tutorial-wrapper')
  wrapper.style.display = 'block'

  const tutorial = document.createElement('div')
  tutorial.classList.add('tutorial')

  const closeButton = document.createElement('div')
  closeButton.id = 'tutorial-close'
  closeButton.innerHTML = 'X'
  closeButton.addEventListener('click', hideTutorial)

  tutorial.appendChild(closeButton)

  const header = document.createElement('h1')
  header.innerHTML = lang.title || langs.en.title

  tutorial.appendChild(header)
  tutorial.appendChild(document.createElement('hr'))

  let p = document.createElement('p')
  p.innerHTML = lang.tutorial[0] || langs.en.tutorial[0]

  tutorial.appendChild(p)

  const disp = document.createElement('div')
  disp.classList.add('tut-display')
  p = document.createElement('p')
  p.innerHTML = (lang.tutorial[1] || langs.en.tutorial[1]) + ' ->'
  disp.appendChild(p)
  const offCell = document.createElement('div')
  offCell.classList.add('cell')
  offCell.style.backgroundImage = `url('${offImage}')`
  disp.appendChild(offCell)
  const onCell = document.createElement('div')
  onCell.classList.add('cell')
  onCell.style.backgroundImage = `url('${onImage}')`
  disp.appendChild(onCell)
  p = document.createElement('p')
  p.innerHTML = '<- ' + (lang.tutorial[2] || langs.en.tutorial[2])
  disp.appendChild(p)
  tutorial.appendChild(disp)

  const h2 = document.createElement('h2')
  h2.innerHTML = lang.tutorial[3] || langs.en.tutorial[3]

  tutorial.appendChild(h2)

  p = document.createElement('p')
  p.innerHTML = lang.tutorial[4] || langs.en.tutorial[4]
  tutorial.appendChild(p)

  const div = document.createElement('div')
  div.classList.add('game')
  div.style.pointerEvents = 'none'
  const tutorialField = new Field(div, 4)
  tutorial.appendChild(div)

  const cells = [[1, null], [2, null], [null, 4]]

  const int = (field, cells) => {
    cells.forEach((cell, i) => {
      let [x, y] = cell
      if (!x) y--
      field.toggleCells(x, y, 0)

      setTimeout((x, y) => {
        if (x == null) tutorialField.bottomSwitches[y+1].highlight()
        else field.leftSwitches[x].highlight()
      }, 2000 * (i + 1) - 500, x, y)
      setTimeout((x, y) => {
        if (x == null) tutorialField.bottomSwitches[y+1].highlight()
        else field.leftSwitches[x].highlight()
        field.toggleCells(x, y, 0)
      }, 2000 * (i + 1), x, y)
    })

    setTimeout(() => {
      field.flicker()
    }, 2000 * cells.length + 1000)

    cells = cells.reverse()
  }
  int(tutorialField, cells)

  tutorialInterval = setInterval((field, cells) => {
    int(field, cells)
  }, 2000 * (cells.length + 2), tutorialField, cells)

  wrapper.appendChild(tutorial)
}

function hideTutorial() {
  const wrapper = document.querySelector('#tutorial-wrapper')
  wrapper.innerHTML = ''
  wrapper.style.display = 'none'

  clearInterval(tutorialInterval)
}
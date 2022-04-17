import './style.css'

import { Field } from './classes'
import { ru, en } from './lang/langs'

import offImage from './img/off.png'
import onImage from './img/on.png'

let fieldDimension = 10
let field
let fieldSize
let maxFieldSize = 600

let container

let langs = { ru: ru, en: en }
let lang = en

let tip
let tutorialInterval
let showTip

setup()

function setup() {
  setLang(navigator.language.substring(0, 2))
  window.top.postMessage('getLang', '*')

  container = document.querySelector('#game')

  // let resetB = document.querySelector('#reset')
  // resetB.addEventListener('click', resetter)
  // resetB.addEventListener('touchstart', resetter)

  let newGame = document.querySelector('#new')
  newGame.addEventListener('click', newField)
  newGame.addEventListener('touchstart', newField)

  let tutorialButton = document.querySelector('#tutorial-button')
  tutorialButton.addEventListener('click', showTutorial)

  field = new Field(fieldDimension, container)
  field.newField()

  window.addEventListener('resize', recalcSizes)

  window.onmessage = function (e) {
    if (e.data.lang) {
      setLang(e.data.lang)
    }
  }

  if (window.self !== window.top) {
    document.querySelector('nav').innerHTML = ''
  }

  recalcSizes()

  showTip = JSON.parse(localStorage.getItem('showTip')) || false
  if (!showTip) {
    setTimeout(() => {
      tip = document.querySelector('#tip')
      tip.style.opacity = 1
      tip.style.pointerEvents = 'auto'
      tip.addEventListener('click', () => {
        localStorage.setItem('showTip', true)
        tip.style.opacity = 0
      })
    }, 2000)
  }
}

function setLang(language) {
  if (langs[language]) {
    lang = langs[language]
  }
  else lang = langs['en']
  let newGame = document.querySelector('#new-game')
  newGame.innerHTML = lang.newGame || en.newGame

  let tip = document.querySelector('#tip')
  tip.innerHTML = lang.tip || lang.tip
}

function recalcSizes() {
  fieldSize = Math.min(maxFieldSize, window.innerWidth, window.innerHeight) - 60
  let cellSize = fieldSize / (fieldDimension + 1)

  container.style.width = `${fieldSize}px`

  if (field) field.setSize(cellSize)
  //container.style.height = `${fieldSize}px`
}

function newField() {
  if (field) field.newField()
}

function showTutorial() {
  if (!showTip) {
    localStorage.setItem('showTip', true)
    tip.style.opacity = 0
  }

  let wrapper = document.querySelector('#tutorial-wrapper')
  wrapper.style.display = 'flex'

  let tutorial = document.createElement('div')
  tutorial.classList.add('tutorial')

  let closeButton = document.createElement('div')
  closeButton.id = 'tutorial-close'
  closeButton.innerHTML = 'X'
  closeButton.addEventListener('click', hideTutorial)

  tutorial.appendChild(closeButton)

  let header = document.createElement('h1')
  header.innerHTML = lang.title || en.title

  tutorial.appendChild(header)
  tutorial.appendChild(document.createElement('hr'))

  let p = document.createElement('p')
  p.innerHTML = lang.tutorial[0] || en.tutorial[0]

  tutorial.appendChild(p)

  let disp = document.createElement('div')
  disp.classList.add('tut-display')
  p = document.createElement('p')
  p.innerHTML = (lang.tutorial[1] || en.tutorial[1]) + ' ->'
  disp.appendChild(p)
  let offCell = document.createElement('div')
  offCell.classList.add('cell')
  offCell.style.backgroundImage = `url('${offImage}')`
  disp.appendChild(offCell)
  let onCell = document.createElement('div')
  onCell.classList.add('cell')
  onCell.style.backgroundImage = `url('${onImage}')`
  disp.appendChild(onCell)
  p = document.createElement('p')
  p.innerHTML = '<- ' + (lang.tutorial[2] || en.tutorial[2])
  disp.appendChild(p)
  tutorial.appendChild(disp)

  let h2 = document.createElement('h2')
  h2.innerHTML = lang.tutorial[3] || en.tutorial[3]

  tutorial.appendChild(h2)

  p = document.createElement('p')
  p.innerHTML = lang.tutorial[4] || en.tutorial[4]
  tutorial.appendChild(p)

  let div = document.createElement('div')
  div.classList.add('game')
  div.style.pointerEvents = 'none'
  let tutorialField = new Field(4, div)
  tutorial.appendChild(div)

  let int = () => {
    tutorialField.toggleCells(1, null, 0)
    tutorialField.toggleCells(2, null, 0)
    tutorialField.toggleCells(null, 3, 0)

    setTimeout(() => {
      tutorialField.leftSwitches[1].highlight()
    }, 1500)
    setTimeout(() => {
      tutorialField.leftSwitches[1].highlight()
      tutorialField.toggleCells(1, null, 0)
    }, 2000)
    setTimeout(() => {
      tutorialField.leftSwitches[2].highlight()
    }, 3500)
    setTimeout(() => {
      tutorialField.leftSwitches[2].highlight()
      tutorialField.toggleCells(2, null, 0)
    }, 4000)
    setTimeout(() => {
      tutorialField.bottomSwitches[4].highlight()
    }, 5500)
    setTimeout(() => {
      tutorialField.bottomSwitches[4].highlight()
      tutorialField.toggleCells(null, 3, 0)
    }, 6000)
    setTimeout(() => {
      tutorialField.flicker()
    }, 7000)
  }
  int()

  tutorialInterval = setInterval(() => {
    int()
  }, 10000)

  wrapper.appendChild(tutorial)
}

function hideTutorial() {
  let wrapper = document.querySelector('#tutorial-wrapper')
  wrapper.innerHTML = ''
  wrapper.style.display = 'none'

  clearInterval(tutorialInterval)
}


// function resetter() {}
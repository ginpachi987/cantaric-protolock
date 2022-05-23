import './style.css'
import { langs } from './lang/langs'
import { showTutorial } from './scripts/tutorial'
import { preload } from './scripts/images'
import { Field } from './scripts/field'

const fieldDimension = 10
const maxFieldSize = 600
let field
let fieldSize

const container = document.querySelector('.game')

let lang = langs.en
let tip
let showTip

preload()
setup()

function setup() {
  setLang(navigator.language.substring(0, 2))

  const newGame = document.querySelector('#new')
  newGame.addEventListener('click', newField)

  const tutorialButton = document.querySelector('#tutorial-button')
  tutorialButton.addEventListener('click', () => { showTutorial(showTip, lang) })

  field = new Field(container, fieldDimension)
  field.newField()

  window.addEventListener('resize', recalcSizes)
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
  else lang = langs.en
  const newGame = document.querySelector('#new-game')
  newGame.innerHTML = lang.newGame || langs.en.newGame

  const tip = document.querySelector('#tip')
  tip.innerHTML = lang.tip || langs.en.tip
}

function recalcSizes() {
  fieldSize = Math.min(maxFieldSize, window.innerWidth, window.innerHeight) - 60
  const cellSize = fieldSize / (fieldDimension + 1)

  container.style.width = `${fieldSize}px`

  if (field) field.setSize(cellSize)
}

function newField() {
  if (field) field.newField()
}
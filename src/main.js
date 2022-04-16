import './style.css'

import { Field } from './classes'
import { ru, en } from './lang/langs'

// let cellSize
let fieldDimension = 10
let circleSize = 30
let field
let fieldSize
let maxFieldSize = 600

let selectedContoller, cX, cY

let off, on

let container

let langs = { ru: ru, en: en }
let lang = en

let tip

setup()

function setup() {
  setLang('en')
  window.top.postMessage('getLang', '*')

  container = document.querySelector('#game')

  // let resetB = document.querySelector('#reset')
  // resetB.addEventListener('click', resetter)
  // resetB.addEventListener('touchstart', resetter)

  let newGame = document.querySelector('#new')
  newGame.addEventListener('click', newField)
  newGame.addEventListener('touchstart', newField)

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

  let showTip = JSON.parse(localStorage.getItem('showTip')) || false
  console.log(showTip)
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
  lang = langs[language]
  let newGame = document.querySelector('#new-game')
  newGame.innerHTML = lang.newGame || en.newGame

  let tip = document.querySelector('#tip')
  tip.innerHTML = lang.tip || lang.tip
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



// function resetter() {}
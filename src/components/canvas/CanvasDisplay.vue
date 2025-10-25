<script setup lang="ts">
import { ref } from 'vue'
import Canvas from './Canvas.vue'

const color = ref<string>('#000000')
let imgURL = "https://google.com"
let thingType = "pet"
let thingName
let createdBy = ""

function resetCanvas() {
  try {
    const canvas = document.querySelector('canvas')
    if (canvas) {
      const context = canvas.getContext('2d')
      context!.clearRect(0, 0, canvas.width, canvas.height)
    } else {
      console.log("Canvas not found!")
    }
  } catch (error : any) {
    console.log(error)
  }}

function handleColor(e: Event) {
  if (e.target) {
    color.value = (e.target as HTMLInputElement).value.toString()
    console.log(color.value)
  }
}

function handleSubmit() {
  try {
    thingName = prompt(`Name your ${thingType}:`)

    if (thingName) {
      const canvas = document.querySelector('canvas')
      if (canvas) {
        const date = new Date().toUTCString().replace(',', '').replace(/ /g,"-")
        const image = canvas.toDataURL('image/png')
        const fimg = document.querySelector('#finishedImg')
        fimg!.href = image;
        fimg!.download = `${thingType}-${thingName}-${date}`; // Or any desired filename
        console.log(image)
      } else {
        console.log("Canvas not found!")
      }
    } else {
      alert(`You must name your ${thingType}! Please try again.`)
    }
  } catch (error : any) {
    console.log(error)
  }
}


</script>

<template>
  <div class="page-header">
    <h1>Canvas page</h1>
    <p>This is where you draw on a canvas.</p>

  <div class="navbar">
    <div>
      <button @click="resetCanvas">Reset</button>
      <button @click="handleSubmit">Finish</button>
    </div>
    <div>
      <a href="finishedImg" id="finishedImg" download>My Finished Image</a>
    </div>
    <div>
      <h3>Colors:</h3>
      <button class="black color" value="#000000" @click="handleColor($event)"></button>
      <button class="white color" value="#FFFFFF" @click="handleColor($event)"></button>
    </div>
  </div>

  </div>
  <div class="page" id="canvasPage">
    <Canvas :size="24" :color="color"></Canvas>
  </div>
</template>

<style lang="css" scoped>
.navbar {
    padding: 1em;
    margin-bottom: 1em;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: gray;
    border-radius: 3px;
}

button, input {
    height: 35px;
    padding: 0 1em;
}

.color {
    width: 1em;
    border-radius: 100%;
}

.black {
    color: white;
    background-color: black;
}

.white {
    color: black;
    background-color: white;
}

.container {
    display: flex;
    width: 100%;
    align-content: center;
    align-items: center;
    justify-content: center;
}

canvas {
    border: 2px solid black;
    min-width: 300px;
    width: 25vw;
    max-width: 500px;
    min-height: 300px;
    height: 25vw;
    max-height: 500px;
}
</style>
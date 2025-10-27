<script setup lang="ts">
import { onMounted, ref } from 'vue'
import Canvas from './Canvas.vue'
import { uploadData } from 'aws-amplify/storage'
import { getCurrentUser } from 'aws-amplify/auth'
import { generateClient } from 'aws-amplify/api'
import type { Schema } from 'amplify/data/resource'
import { useRoute } from 'vue-router'
import { createItem } from '../tools/createItem'
import { createPet } from '../tools/createPet'

const client = generateClient<Schema>()
const route = useRoute()

const color = ref<string>('#000000')
let thingType = route.params.type
let thingName: string | null
var currentUserId : string
var currentUserObj : any
var canCreatePet = true
var canCreateItem = true

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

async function handleSubmit(t : string) {
  switch (t) {
    case "pet":
      thingName = prompt(`Name your ${t}:`)
      if (thingName) {
        var thingSpecies = prompt(`Give your ${t} a species name:`)
        if (thingSpecies) {
          // Set the path
          const thingPath = `images/${currentUserId}/${thingType}/${thingName}.png`
          createPet(thingName!, thingSpecies!, thingPath!, currentUserId, currentUserObj)
        } else {
          alert(`You must set a species name! Please try again.`)
        }
      } else {
        alert(`You must name your ${thingType}! Please try again.`)
      }
      break;
    case "item":
      // Prompt for a name
      thingName = prompt(`Name your ${t}:`)
      // If you get a valid name:
      if (thingName) {
        // Set the path
        const thingPath = `images/${currentUserId}/${thingType}/${thingName}.png`
        createItem(thingName, thingPath, currentUserId, currentUserObj)
      } else {
        alert(`You must name your ${thingType}! Please try again.`)
      }
      break;
    default:
      console.log("Invalid route param: ", t)
      return
  }
}


async function setCreation() {
  const { userId } = await getCurrentUser()
  currentUserId = userId
  await client.models.User.get({id: userId})
  .then((u) => {
    currentUserObj = u.data
      if ((u) && (u.data) && (u.data.itemsRemaining)) {
        if (u.data.itemsRemaining > 0)
          canCreateItem = true
      }
      if ((u) && (u.data) && (u.data.petsRemaining)) {
        if (u.data.petsRemaining > 0)
          canCreatePet = true
      }
    })
}

onMounted(async () => {
  await setCreation()
})

</script>

<template>
  <div class="page-header">
    <h1>Canvas page</h1>
    <p>This is where you draw on a canvas.</p>
  </div>
    <template v-if="canCreatePet || canCreateItem" >
      <div class="navbar">
        <div>
          <button @click="resetCanvas">Reset</button>
          <button @click="handleSubmit(route.params.type.toString())">Finish</button>
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
  
      <div class="page" id="canvasPage">
        <Canvas :size="24" :color="color"></Canvas>
      </div>
    </template>
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
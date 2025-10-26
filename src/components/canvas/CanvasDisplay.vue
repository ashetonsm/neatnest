<script setup lang="ts">
import { onMounted, ref } from 'vue'
import Canvas from './Canvas.vue'
import { uploadData } from 'aws-amplify/storage'
import { getCurrentUser } from 'aws-amplify/auth'
import { generateClient } from 'aws-amplify/api'
import type { Schema } from 'amplify/data/resource'
import { useRoute } from 'vue-router'

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

async function handleSubmit() {
  try {
    thingName = prompt(`Name your ${route.params.type}:`)

    if (thingName) {
      const canvas = document.querySelector('canvas')
      if (canvas) {
        const thingPath = `images/${currentUserId}/${thingType}/${thingName}.png`
        canvas.toBlob(async (blob) => {
          try {
            const result = await uploadData({
              path: thingPath,
              data: blob!,
              options: {
                contentType: 'image/png'
              }
            }).result;
           console.log(`${currentUserId}/${thingType}s/${thingName}`)
            console.log('Succeeded: ', result);
          } catch (error) {
            console.log('Error : ', error);
          }

        }, 'image/png')
        
        // Create the thing (Item only)
        try {
          client.models.Item.create({
            name: thingName,
            price: 1,
            shopfront: "NA",
            owner: currentUserId,
            health: 1,
            rarity: 1,
            image: thingPath
          }).then((res) => {
            // Update the user by decreasing itemsRemaining by 1 if itemsRemaining > 0

            console.log("currentUserObj:", currentUserObj)
            var updatedUser = currentUserObj
            // Subtract 1 from itemsRemaining
            updatedUser.itemsRemaining = updatedUser.itemsRemaining - 1
            // Update the updatedAt time for the User
            updatedUser.updatedAt = new Date().toISOString()

            client.models.User.update(updatedUser)
              .then((res) => {
                console.log("updatedUser: ", updatedUser)
                console.log(res)
              })
            console.log(res)
          });
        } catch (error : any) {
          console.log(error)
        }
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

async function setCreation() {
  const { userId } = await getCurrentUser()
  currentUserId = userId
  await client.models.User.get({id: userId})
  .then((u) => {
    currentUserObj = u.data
      if ((u) && (u.data) && (u.data.itemsRemaining)) {
        if (u.data.itemsRemaining > 0)
          console.log(u.data.itemsRemaining)
          canCreateItem = true
      }
      if ((u) && (u.data) && (u.data.petsRemaining)) {
        if (u.data.petsRemaining > 0)
          console.log(u.data.petsRemaining)
          canCreatePet = true
      }
      console.log(u)
    })
}

onMounted(() => {
  setCreation()
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
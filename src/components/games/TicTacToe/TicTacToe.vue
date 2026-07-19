<script setup lang="ts">
import { PUT_DATA } from '@/components/tools/ddbActions';
import { userStore } from '@/stores/user';
import { ref, toRaw, watch } from 'vue'

const user = userStore()
const clicked_p1 = ref<Array<string>>([]);
const clicked_cpu = ref<Array<string>>([]);
const clicked_all = ref<Array<string>>([]);
const gameOver = ref(false)
const winner = ref("Undetermined!")

const resetGame = () => {
  var elements = document.querySelectorAll(`[id^='block_']`);
    if (elements) {
      elements.forEach(element => {
        element.innerHTML = "_"
      });
    }
  clicked_p1.value = []
  clicked_cpu.value = []
  clicked_all.value = []
  winner.value = "Undetermined!"
  gameOver.value = false
}

const handleSpace = (spaceObj: any) => {
  try {
    if (!gameOver.value) {
      var blockNumber = null
      if (spaceObj.id) {
        blockNumber = parseInt(spaceObj.id.split("_")[1])
        if (!clicked_all.value.includes(blockNumber.toString())) {
          
          console.log("Pressed a space", spaceObj.id, spaceObj.id.split("_")[1])
          var textToReplace = document.getElementById(spaceObj.id);
          if (textToReplace) {
            textToReplace.innerHTML = "X"
          }
          // Push to the appropriate array
          clicked_p1.value.push(blockNumber.toString())
          clicked_all.value.push(blockNumber.toString())
          setTimeout(() => {if (!gameOver.value) {computerPlayer()}}, 100)
        } else {
          return console.error("Someone already marked this space.")
        }
      } 
    }
  } catch (error: any) {
    console.error("Oops, something went wrong:", error)
  }
}

const computerPlayer = () => {
  var computerBlock = Math.floor(Math.random() * 10);
  if (computerBlock == 10) {computerBlock = 9}
  if (computerBlock == 0) {computerBlock = 1}
  var complete = false

  while (!complete) {
    if (!clicked_all.value.includes(computerBlock.toString())) {
      const blockId = "block_" + computerBlock
      var textToReplace = document.getElementById(blockId);
      if (textToReplace) {
        textToReplace.innerHTML = "O"
      }
      // Push to the appropriate array
      clicked_cpu.value.push(computerBlock.toString())
      clicked_all.value.push(computerBlock.toString())
      complete = true
    } else {
      console.error("the computer chose a space that was already taken, so we're rerolling.")
      computerBlock = Math.floor(Math.random() * 10)
      if (computerBlock == 10) {computerBlock = 9}
      if (computerBlock == 0) {computerBlock = 1}
    }
  }
}

/**
 * Sends the score, which is always 5 credits for this game.
 * Max out at 100 credits earned per day, after which none will be awarded.
 */
const sendScore = async () => {
  var updatedUser = user.getUser
  updatedUser.credits = user.credits + 5
  await PUT_DATA(updatedUser)
  return
}

watch(gameOver, async (newValue) => {
  if (newValue == true && winner.value == "nobody") {
    await sendScore()
  }
})

watch([clicked_p1, clicked_cpu], () => {
  const p1_array = toRaw(clicked_p1.value)
  const cpu_array = toRaw(clicked_cpu.value)
  var p1_string = ""
  var cpu_string = ""
  p1_array.forEach(element => {
    p1_string = p1_string.concat(element[0].toString())
  });
  cpu_array.forEach(element => {
    cpu_string = cpu_string.concat(element[0].toString())
  });

  if (
    p1_string.includes("1") && p1_string.includes("2") && p1_string.includes("3") ) {
    winner.value = "P1"
    gameOver.value = true
  }
  if (p1_string.includes("4") && p1_string.includes("5") && p1_string.includes("6") ) {
    winner.value = "P1"
    gameOver.value = true
  }
  if (p1_string.includes("7") && p1_string.includes("8") && p1_string.includes("9") ) {
    winner.value = "P1"
    gameOver.value = true
  }
  if (p1_string.includes("1") && p1_string.includes("5") && p1_string.includes("9") ) {
    winner.value = "P1"
    gameOver.value = true
  }
  if (p1_string.includes("3") && p1_string.includes("5") && p1_string.includes("7") ) {
    winner.value = "P1"
    gameOver.value = true
  }
  if (p1_string.includes("1") && p1_string.includes("4") && p1_string.includes("7") ) {
    winner.value = "P1"
    gameOver.value = true
  }
  if (p1_string.includes("3") && p1_string.includes("6") && p1_string.includes("9") ) {
    winner.value = "P1"
    gameOver.value = true
  }
  if (p1_string.includes("2") && p1_string.includes("5") && p1_string.includes("8") ) {
    winner.value = "P1"
    gameOver.value = true
  }

  if (
    cpu_string.includes("1") && cpu_string.includes("2") && cpu_string.includes("3") ) {
    winner.value = "The computer"
    gameOver.value = true
  }
  if (cpu_string.includes("4") && cpu_string.includes("5") && cpu_string.includes("6") ) {
    winner.value = "The computer"
    gameOver.value = true
  }
  if (cpu_string.includes("7") && cpu_string.includes("8") && cpu_string.includes("9") ) {
    winner.value = "The computer"
    gameOver.value = true
  }
  if (cpu_string.includes("1") && cpu_string.includes("5") && cpu_string.includes("9") ) {
    winner.value = "The computer"
    gameOver.value = true
  }
  if (cpu_string.includes("3") && cpu_string.includes("5") && cpu_string.includes("7") ) {
    winner.value = "The computer"
    gameOver.value = true
  }
  if (cpu_string.includes("1") && cpu_string.includes("4") && cpu_string.includes("7") ) {
    winner.value = "The computer"
    gameOver.value = true
  }
  if (cpu_string.includes("3") && cpu_string.includes("6") && cpu_string.includes("9") ) {
    winner.value = "The computer"
    gameOver.value = true
  }
  if (cpu_string.includes("2") && cpu_string.includes("5") && cpu_string.includes("8") ) {
    winner.value = "The computer"
    gameOver.value = true
  }

  if (clicked_all.value.length == 9 && !gameOver.value) {
    winner.value = "Nobody"
    gameOver.value = true
    return
  }

}, { deep: true })

</script>

<template>
    <div class="row-container">
      <div @click="handleSpace($event.target)" id="block_1">_</div>
      <div @click="handleSpace($event.target)" id="block_2">_</div>
      <div @click="handleSpace($event.target)" id="block_3">_</div>
      
      <div @click="handleSpace($event.target)" id="block_4">_</div>
      <div @click="handleSpace($event.target)" id="block_5">_</div>
      <div @click="handleSpace($event.target)" id="block_6">_</div>
      
      <div @click="handleSpace($event.target)" id="block_7">_</div>
      <div @click="handleSpace($event.target)" id="block_8">_</div>
      <div @click="handleSpace($event.target)" id="block_9">_</div>
    </div>
  <template v-if="gameOver">
    <h1>{{ winner }} wins!</h1>
    <button @click="() => resetGame()">Play again?</button>
  </template>

</template>

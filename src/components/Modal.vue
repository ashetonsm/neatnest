<script setup lang="ts">
import type { Schema } from '../../amplify/data/resource';
import { onMounted, ref } from 'vue';

const props = defineProps<{
  pet: Schema['Pet']['type'],
  items: Array<Schema['Item']['type']>
}>()

const emit = defineEmits<{
  (e: 'open', value: boolean) : boolean
}>()

var foodOptions: any

var playOptions: any

onMounted(() => {
  console.log(props.items)
  const itemFilter1 = props.items
  const itemFilter2 = props.items
  foodOptions = itemFilter1.filter((item) => 
    item.category == "food"
  )
  playOptions = itemFilter2.filter((item) => 
    item.category == "entertainment"
  )
  console.log("foodOptions: ", foodOptions)
  console.log("playOptions: ", playOptions)
})

</script>
<template>
  <Teleport to="body">
  <div class="modal">
    <button class="closeButton" @click="emit('open', false)">Cancel</button>
    <div class="info">
      <h1>What would you like to do with {{ pet.name }}?</h1>
    </div>
    <div class="select-input-container">
      <h2>Feed</h2>
      <select v-model="foodOptions">
        <option disabled value="">Please select one</option>
        <option v-for="item in foodOptions" :value="item.name">
          {{ item.name }}
        </option>
      </select>
      <button @click="emit('open', false)">Do it!</button>
    </div>

    <div class="select-input-container">
      <h2>Play</h2>
      <select v-model="playOptions">
        <option disabled value="">Please select one</option>
        <option v-for="toy in playOptions" :value="toy.name">
          {{ toy.name }}
        </option>
      </select>
    </div>

    <button @click="emit('open', false)">Do it!</button>
    </div>
  <div id="modal-block" @scroll.prevent @touchmove.prevent @wheel.prevent>You can't click on anything else</div>
  </Teleport>
</template>

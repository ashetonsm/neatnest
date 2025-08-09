<script setup lang="ts">
import type { PetType } from '@/assets/PetExports';
import { ref } from 'vue';

defineProps<{
  pet: PetType
}>()

const emit = defineEmits<{
  (e: 'open', value: boolean) : boolean
}>()

const food = ref('A')
const entertainment = ref('A')

const foodOptions = ref([
  { text: 'Cake', value: 'A' },
  { text: 'Test Food 1', value: 'B' },
  { text: 'Test Food 2', value: 'C' }
])
const entertainmentOptions = ref([
  { text: 'Soccer Ball', value: 'A' },
  { text: 'Rubber Duck', value: 'B' },
  { text: 'Stuffed Bunny', value: 'C' }
])

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
      <select v-model="food">
        <option disabled value="">Please select one</option>
        <option v-for="food in foodOptions" :value="food.value">
          {{ food.text }}
        </option>
      </select>
      <button @click="emit('open', false)">Do it!</button>
    </div>

    <div class="select-input-container">
      <h2>Entertain</h2>
      <select v-model="entertainment">
        <option disabled value="">Please select one</option>
        <option v-for="entertainment in entertainmentOptions" :value="entertainment.value">
          {{ entertainment.text }}
        </option>
      </select>
    </div>

    <button @click="emit('open', false)">Do it!</button>
    </div>
  <div id="modal-block" @scroll.prevent @touchmove.prevent @wheel.prevent>You can't click on anything else</div>
  </Teleport>
</template>

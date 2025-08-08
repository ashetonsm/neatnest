<script setup lang="ts">
import Pet from './Pet.vue'

const pets = [
  { name: 'samia', hunger: 'full', mood: 'content', image: '1' },
  { name: 'brae', hunger: 'starving', mood: 'happy', image: '2' }
]

</script>

<template>

  <template v-if="!pets">
    <h1>Loading!</h1>
  </template>
  <template v-else-if="!pets.length">
    <h1>No pets found</h1>
  </template>
  <template v-else>
    <h1>Your pets</h1>
    <Pet v-for="(pet, i) in pets" :key=pet.name :pet=pet />
  </template>
</template>

<script setup lang="ts">
import { testPets } from '@/assets/testData/petObjectList';
import Pet from './Pet.vue'
import type { PetType } from '@/assets/PetExports';

var pets = testPets.filter(function (pet: PetType) {
  return pet.owner == 'nnneato'
});

</script>

<template>
    <div class="page-header">
      <h1>Your pets</h1>
      <p>This is where you view your pets.</p>
  </div>
  <div class="page" id="petsPage">
    <template v-if="!pets">
      <h1>Loading!</h1>
    </template>
    <template v-else-if="!pets.length">
      <h1>No pets found</h1>
    </template>
    <template v-else>
      <Pet v-for="(pet, i) in pets" :key=pet.name :pet=pet />
    </template>
  </div>

</template>

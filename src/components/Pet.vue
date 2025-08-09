<script setup lang="ts">
import type { PetType } from '@/assets/PetExports';

defineProps<{
  pet: PetType
}>()

function openModal(i : PetType) {
  return console.log("clicked " + i.name)
}

</script>

<template>
  <div class="pet-container box">

    <div class="pet-image">
        <img :src="'/src/assets/testPets/' + pet.image + '.jpg'" 
        :alt="'an image of ' + pet.name"
        @click="openModal(pet)"/>
        <!-- <img src="@/assets/testPets/1.jpg"> -->
         <!-- For some reason, we can't use a "@" alias here for our string literal -->
</div>

    <div class="pet-info">
        <h1 class="green">{{ pet.name }}</h1>
        <h2>hunger:</h2>
        <h2 class="green">{{ pet.hunger }}</h2>
        <h2 >mood:</h2>
        <h3 class="green">{{ pet.mood }}</h3>
    </div>
  </div>
</template>

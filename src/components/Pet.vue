<script setup lang="ts">
import Modal from './Modal.vue'
import { ref } from 'vue'
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../amplify/data/resource';

const client = generateClient<Schema>() // use this Data client for CRUDL requests
const open = ref(false)

defineProps<{
  pet: Schema['Pet']['type']
}>()

const toggleModal = (n:boolean) => {
  console.log('Modal toggled');
  open.value = n
  console.log(open)
  return open
};


</script>

<template>

<div v-if="open == true">
  <Modal :pet="pet" @open="toggleModal(false)"/>
</div>

  <div class="pet-container box">
    <div class="pet-image">
        <img :src="'/src/assets/testPets/' + pet.image + '.jpg'" 
        :alt="'an image of ' + pet.name"
        @click="toggleModal(true)"/>
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

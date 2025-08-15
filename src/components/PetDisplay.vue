<script setup lang="ts">
import Pet from './Pet.vue'
import { onMounted, ref } from 'vue';
import type { Schema } from '../../amplify/data/resource';
import { generateClient } from 'aws-amplify/api';

const client = generateClient<Schema>()

const fetchedPets = ref<Array<Schema['Item']['type']>>([]);

async function fetchPets() {
  const { data: pets, errors } = await client.models.Pet.list(  
  {
    authMode: 'userPool',
  });
  fetchedPets.value = pets
}

onMounted(() => {
  fetchPets()
})

</script>

<template>
    <div class="page-header">
      <h1>Your pets</h1>
      <p>This is where you view your pets.</p>
  </div>
  <div class="page" id="petsPage">
    <template v-if="!fetchedPets">
      <h1>Loading!</h1>
    </template>
    <template v-else-if="!fetchedPets.length">
      <h1>No pets found</h1>
    </template>
    <template v-else>
      <Pet v-for="(pet, i) in fetchedPets" :key="pet.name ?? i" :pet=pet />
    </template>
  </div>

</template>

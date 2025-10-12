<script setup lang="ts">
import Pet from './Pet.vue'
import { onMounted, ref } from 'vue';
import type { Schema } from '../../amplify/data/resource';
import { generateClient } from 'aws-amplify/api';
import { getCurrentUser } from 'aws-amplify/auth';

const client = generateClient<Schema>()

const fetchedPets = ref<Array<Schema['Pet']['type']>>([]);
var createPet = false;

async function fetchPets() {
  const cachedPets = localStorage.getItem('pets')
  if (cachedPets) {
    console.log("Cached pets found.")
    fetchedPets.value = JSON.parse(cachedPets)
  } else {
    console.log("No cached pets found, querying database.")
    const {signInDetails } = await getCurrentUser()

    const { data: pets, errors } = await client.models.Pet.listPetsByOwnerAndName(
      {
        owner: signInDetails?.loginId ?? 'undefined',
      },
      {
        authMode: 'userPool',
      }
    );
    localStorage.setItem('pets', JSON.stringify(pets))
    fetchedPets.value = pets
  }
}

async function setCreation() {
  const {signInDetails, userId, username } = await getCurrentUser()
  console.log(signInDetails)
  console.log(userId)
  await client.models.User.listUserByUsername({ username: signInDetails?.loginId ?? 'undefined' })
    .then((data) => {
      console.log(data)
      createPet = true
    })
  
}

onMounted(() => {
  fetchPets()
  setCreation()
})

</script>

<template>
    <div class="page-header">
      <h1>Your pets</h1>
      <p>This is where you view your pets.</p>
  </div>
  <div class="page" id="petsPage">
    <template v-if="createPet">
      <button>Create a new pet</button>
    </template>
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

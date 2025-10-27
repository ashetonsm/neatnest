<script setup lang="ts">
import Pet from './Pet.vue'
import { onMounted, ref } from 'vue';
import type { Schema } from '../../amplify/data/resource';
import { generateClient } from 'aws-amplify/api';
import { getCurrentUser } from 'aws-amplify/auth';

const client = generateClient<Schema>()

const fetchedPets = ref<Array<Schema['Pet']['type']>>([]);
var currentUser: string
var canCreate = true;

async function fetchPets() {
  const cachedPets = localStorage.getItem('pets')
  if (cachedPets) {
    console.log("Cached pets found.")
    fetchedPets.value = JSON.parse(cachedPets)
  } else {
    console.log("No cached pets found, querying database.")
    const { data: pets } = await client.models.Pet.listPetsByOwnerAndName(
      {
        owner: currentUser ?? 'undefined'
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
  const { userId } = await getCurrentUser()
  currentUser = userId
  await client.models.User.get({id: userId})
    .then((u) => {
      if ((u) && (u.data) && (u.data.petsRemaining)) {
        if (u.data.petsRemaining > 0)
          canCreate = true
      }
      console.log(u)
    })
}

onMounted(() => {
  setCreation()
  fetchPets()
})

</script>

<template>
    <div class="page-header">
      <h1>Your pets</h1>
      <p>This is where you view your pets.</p>
  </div>
  <div class="page" id="petsPage">
    <template v-if="canCreate">
      <div>
        <a href="/canvas/pet" target="_blank">Launch pet canvas</a>
      </div>
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

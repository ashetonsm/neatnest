<script setup lang="ts">
import Pet from "./Pet.vue";
import { onMounted, ref } from "vue";
import type { Schema } from "../../amplify/data/resource";
import { userStore } from "@/stores/user";
const store = userStore();

const fetchedPets = ref<Array<Schema["Pet"]["type"]>>([]);
const fetchedItems = ref<Array<Schema["Item"]["type"]>>([]);
var canCreate = true;

async function setCreation() {
  if (store.getUser.petsRemaining > 0) {
    canCreate = true;
  }
}

onMounted(async () => {
  await setCreation();
  fetchedPets.value = JSON.parse(JSON.stringify(store.getPets));
  fetchedItems.value = JSON.parse(JSON.stringify(store.getInventory));
});
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
      <Pet
        v-for="(pet, i) in fetchedPets"
        :key="pet.name ?? i"
        :pet="pet"
        :items="fetchedItems"
      />
    </template>
  </div>
</template>

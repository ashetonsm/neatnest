<script setup lang="ts">
import Pet from "./Pet.vue";
import { onMounted, ref } from "vue";
import { userStore } from "@/stores/user";
const user = userStore();

const fetchedPets = ref<Array<any>>([]);
const fetchedItems = ref<Array<any>>([]);
var canCreate = true;

async function setCreation() {
  if (user.getUser?.petsRemaining! > 0) {
    canCreate = true;
  }
}

onMounted(async () => {
  await setCreation();
  fetchedPets.value = JSON.parse(JSON.stringify(user.getPets));
  fetchedItems.value = JSON.parse(JSON.stringify(user.getInventory));
});
</script>

<template>
  <v-sheet
    class="d-flex align-center justify-center text-center mx-auto pa-8"
    elevation="4"
    width="100%"
    rounded
  >
    <v-row>
      <v-col md="12" class="text-center">
        <h2 class="text-h4 font-weight-black ma-4">Your Pets</h2>

        <v-alert
          v-if="!fetchedPets"
          title="Loading..."
          type="info"
          class="ma-4"
        ></v-alert>
        <v-alert
          v-else-if="!fetchedPets.length"
          title="Aw... you have no pets!"
          type="info"
          class="ma-4"
        ></v-alert>

        <v-btn
          v-if="canCreate"
          color="primary"
          to="/canvas/pet"
          class="mb-4"
          target="_blank"
          >Launch Canvas
        </v-btn>

        <v-btn color="secondary" to="/trades" class="mb-4">Your Trades </v-btn>

        <v-row class="ga-4">
          <Pet
            v-for="(pet, i) in fetchedPets"
            :key="pet.name ?? i"
            :pet="pet"
            :items="fetchedItems"
          />
        </v-row>
      </v-col>
    </v-row>
  </v-sheet>
</template>

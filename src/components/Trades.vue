<script setup lang="ts">
import Pet from "./Pet.vue";
import { ref } from "vue";
import type { Schema } from "../../amplify/data/resource";
import { userStore } from "@/stores/user";
const user = userStore();

const fetchedTrades = ref<Array<Schema["Pet"]["type"]>>([]);
const fetchedItems = ref<Array<Schema["Item"]["type"]>>([]);

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
        <h2 class="text-h4 font-weight-black ma-4">Your Trades</h2>

        <v-alert
          v-if="!fetchedTrades"
          title="Loading..."
          type="info"
          class="ma-4"
        ></v-alert>
        <v-alert
          v-else-if="!fetchedTrades.length"
          title="No trade history found!"
          type="info"
          class="ma-4"
        ></v-alert>

        <v-row class="ga-4">
          <Pet
            v-for="(pet, i) in fetchedTrades"
            :key="pet.name ?? i"
            :pet="pet"
            :items="fetchedItems"
          />
        </v-row>
      </v-col>
    </v-row>
  </v-sheet>
</template>

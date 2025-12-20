<script setup lang="ts">
import Item from "./Item.vue";
import { onMounted, ref } from "vue";
import type { Schema } from "../../amplify/data/resource";
import { userStore } from "@/stores/user";

// These should be items where the owner is the logged in user
const store = userStore();

// create a reactive reference to Item[]
const fetchedItems: any = ref<Array<Schema["Item"]["type"]>>([]);
var canCreate = true;

async function setCreation() {
  if (store.getUser.itemsRemaining > 0) {
    canCreate = true;
  }
}

onMounted(async () => {
  await setCreation();
  fetchedItems.value = JSON.parse(JSON.stringify(store.getInventory));
});
</script>

<template>
  <v-sheet
    class="d-flex align-center justify-center flex-wrap text-center mx-auto pa-4"
    elevation="4"
    width="100%"
    rounded
  >
    <v-row>
      <v-col md="12" class="text-center">
        <h2 class="text-h4 font-weight-black ma-4">Your Inventory</h2>

        <v-alert
          v-if="fetchedItems.length == 0"
          title="Your inventory is empty!"
          type="info"
          class="ma-4"
        ></v-alert>
      </v-col>

      <v-col cols="4" class="mx-auto">
        <v-row>
          <v-btn
            v-if="canCreate"
            variant="text"
            to="/canvas/item"
            class="mb-4"
            target="_blank"
            >Launch Canvas
          </v-btn>
        </v-row>

        <Item
          v-if="fetchedItems.length !== 0"
          v-for="(item, i) in fetchedItems"
          :key="item.name ?? i"
          :item="item"
          :currentUser="store.getUser.id"
        />
      </v-col>
    </v-row>
  </v-sheet>
</template>

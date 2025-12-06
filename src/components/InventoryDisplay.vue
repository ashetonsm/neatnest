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
  <div class="page-header">
    <h1>Your Inventory</h1>
    <p>This is where you view your inventory.</p>
  </div>
  <div class="page" id="inventoryPage">
    <div v-if="canCreate">
      <a href="/canvas/item" target="_blank">Launch Item Canvas</a>
    </div>
    <div v-if="fetchedItems.length !== 0">
      <Item
        v-for="(item, i) in fetchedItems"
        :key="item.name ?? i"
        :item="item"
        :currentUser="store.getUser.id"
      />
    </div>
  </div>
  <div v-if="fetchedItems.length == 0">
    <h1>Your inventory is empty</h1>
  </div>
</template>

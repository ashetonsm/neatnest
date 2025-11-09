<script setup lang="ts">
import Item from "./Item.vue";
import { onMounted, ref } from "vue";
import type { Schema } from "../../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { getCurrentUser } from "aws-amplify/auth";
import { fetchInventory } from "./tools/fetchInventory";

// These should be items where the owner is the logged in user
const client = generateClient<Schema>();

// create a reactive reference to Item[]
var fetchedItems = ref<Array<Schema["Item"]["type"]>>([]);
var currentUser: string;
var canCreate = true;

async function setCreation() {
  const { userId } = await getCurrentUser();
  currentUser = userId;
  await client.models.User.get({ id: userId }).then((u) => {
    console.log(u.data?.itemsRemaining);
    if (u && u.data && u.data.itemsRemaining) {
      if (u.data.itemsRemaining > 0) canCreate = true;
    }
  });
}

onMounted(async () => {
  await setCreation();
  fetchedItems = await fetchInventory(currentUser, fetchedItems);
});
</script>

<template>
  <div class="page-header">
    <h1>Your Inventory</h1>
    <p>This is where you view your inventory.</p>
  </div>
  <div class="page" id="inventoryPage">
    <template v-if="canCreate">
      <div>
        <a href="/canvas/item" target="_blank">Launch Item Canvas</a>
      </div>
    </template>
    <template v-if="!fetchedItems">
      <h1>Loading!</h1>
    </template>
    <template v-else-if="!fetchedItems.length">
      <h1>Your inventory is empty</h1>
    </template>
    <template v-else>
      <Item
        v-for="(item, i) in fetchedItems"
        :key="item.name ?? i"
        :item="item"
        :currentUser="currentUser"
      />
    </template>
  </div>
</template>

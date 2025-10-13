<script setup lang="ts">
import Item from './Item.vue';
import { onMounted, ref } from 'vue';
import type { Schema } from '../../amplify/data/resource';
import { generateClient } from 'aws-amplify/data';
import { getCurrentUser } from 'aws-amplify/auth';

// These should be items where the owner is the logged in user
const client = generateClient<Schema>()

// create a reactive reference to Item[]
const fetchedItems = ref<Array<Schema['Item']['type']>>([]);

async function fetchItems() { 
  const cachedItems = localStorage.getItem('inventory')
  if (cachedItems) {
    console.log("Cached inventory found.")
    fetchedItems.value = JSON.parse(cachedItems)
  } else {
    console.log("No cached inventory found, querying database.")
      const { signInDetails } = await getCurrentUser()
    const { data: items, errors } = await client.models.Item.listItemsByOwnerAndName(
      {
        owner: signInDetails?.loginId ?? 'undefined'
      },
      {
        authMode: 'userPool'
      }
    );
    localStorage.setItem('inventory', JSON.stringify(items))
    fetchedItems.value = items
  }
}

onMounted(() => {
  fetchItems()
})


</script>

<template>
    <div class="page-header">
      <h1>Your Inventory</h1>
      <p>This is where you view your inventory.</p>
    </div>
  <div class="page" id="inventoryPage">
    <template v-if="!fetchedItems">
      <h1>Loading!</h1>
    </template>
    <template v-else-if="!fetchedItems.length">
      <h1>Your inventory is empty</h1>
    </template>
    <template v-else>
      <Item v-for="(item, i) in fetchedItems" :key="item.name ?? i" :item="item" />
    </template>
  </div>
</template>

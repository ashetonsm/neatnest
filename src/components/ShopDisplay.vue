<script setup lang="ts">
import Item from './Item.vue';
import { useRoute } from 'vue-router';
import { onMounted, ref } from 'vue';
import { generateClient } from 'aws-amplify/api';
import type { Schema } from '../../amplify/data/resource';
// These should be items that are freely in the pool for this shop

const route = useRoute()

// Determine shop name based on number from route
var shopFrontName = route.params.id == "1" ? "Test Emporium" : "Test Shack"

const client = generateClient<Schema>()

// create a reactive reference to Item[]
const fetchedItems = ref<Array<Schema['Item']['type']>>([]);

async function fetchItems() { 
  const cachedItems = localStorage.getItem(shopFrontName + ' Items')
  if (cachedItems) {
    console.log("Cached shop items found.")
    fetchedItems.value = JSON.parse(cachedItems)
  } else {
    console.log("No cached shop items found, querying database.")
    const { data: items, errors } = await client.models.Item.listItemsByShopfrontAndOwner(
      {
        shopfront: shopFrontName,
        owner: {
          eq: 'NA',
        },
      },
      {
        authMode: 'userPool'
      }
    );
    localStorage.setItem(shopFrontName + ' Items', JSON.stringify(items))
    fetchedItems.value = items
  }
}

onMounted(() => {
  fetchItems()
})

</script>

<template>
  <div class="page-header">
    <h1>{{ shopFrontName }}</h1>
    <p>This is where you shop for things.</p>
  </div>
  <div class="page" id="shopPage">
    <template v-if="!fetchedItems">
      <h1>Loading!</h1>
    </template>
    <template v-if="!fetchedItems.length">
      <h1>This shop is sold out!</h1>
    </template>
    <template v-else>
      <Item v-for="(item, i) in fetchedItems" :key="item.name ?? i" :item="item" />
    </template>
  </div>
</template>

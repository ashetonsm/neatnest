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

const canCreate = true

async function fetchItems() { 
  // const cachedItems = localStorage.getItem('inventory')
  // if (cachedItems) {
    // console.log("Cached inventory found.")
    // fetchedItems.value = JSON.parse(cachedItems)
  // } else {
    console.log("No cached inventory found, querying database.")
      const { userId } = await getCurrentUser()
    const { data: items, errors } = await client.models.Item.listItemsByOwnerAndName(
      {
        owner: userId
      },
      {
        authMode: 'userPool'
      }
    );
    localStorage.setItem('inventory', JSON.stringify(items))
    fetchedItems.value = items
  // }
}

async function createItem() {
  const { userId } = await getCurrentUser()

  const thisUser = await client.models.User.get({id: userId})
  console.log(thisUser)

  // If itemsRemaining is not null and is greater than 0
  if (thisUser.data!.itemsRemaining !== null && thisUser.data!.itemsRemaining > 0) {
    // Create a new item
    client.models.Item.create({
      name: "User-made Item",
      price: 1,
      shopfront: "NA",
      // owner: thisUser.data?.id ?? 'undefined',
      owner: thisUser.data?.id, // IDs will be more unique than emails or usernames
      health: 1,
      rarity: 1,
      image: "placeholder image 1"
    }).then((res) => {
      // Update the user by decreasing itemsRemaining by 1 if itemsRemaining > 0

      var updatedUser = thisUser.data!
      // Subtract 1 from itemsRemaining
      updatedUser.itemsRemaining!--
      // Update the updatedAt time for the User
      updatedUser.updatedAt = new Date().toISOString()

      client.models.User.update(updatedUser)
        .then((res) => {
          console.log(res)
        })
      console.log(res)
    });
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
    <template v-if="canCreate">
      <button @click="createItem">Create a new ITEM</button>
    </template>
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

<script setup lang="ts">
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../amplify/data/resource';
import { getCurrentUser } from 'aws-amplify/auth';

const client = generateClient<Schema>() // use this Data client for CRUDL requests

defineProps<{
  item: Schema['Item']['type']
}>()

async function buyFlow(i : Schema['Item']['type']) {
  const choice = confirm('Buy ' + i.name + ' for ' + i.price + '?')
  if (choice) {
    // Do buy logic, remove item from available and add to player's inventory.
    const { signInDetails } = await getCurrentUser()

    console.log(signInDetails?.loginId ?? 'undefined')
    // Set the owner to the signed in user
    i.owner = signInDetails?.loginId ?? 'undefined'

    // send the update request
     await await client.models.Item.update(i).then((res) => {
      console.log(res)
     })
  } else {
    return console.log(choice)
  }
}

function useFlow(i : Schema['Item']['type']) {
  const choice = confirm('Use ' + i.name + '?')
  if (choice) {
    // Do use logic
    return console.log(choice)
  } else {
    return console.log(choice)
  }
}
</script>

<template>
  <div class="item-container box">
    <div class="item-info">
        <img :src="'/src/assets/testItems/' + item.image + '.jpg'" 
        :alt="'an image of ' + item.name" class="item-image"
        @click="item.owner == 'NA' ? buyFlow(item) : useFlow(item)"/>

        <h2 class="green">{{ item.name }}</h2>
        <h2>Price:</h2>
        <h2 class="green">{{ item.price }}</h2>
    </div>
  </div>
</template>

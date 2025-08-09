<script setup lang="ts">
import type { ItemType } from '@/assets/ItemExports';

defineProps<{
  item: ItemType
}>()

function buyFlow(i : ItemType) {
  const choice = confirm('Buy ' + i.name + ' for ' + i.price + '?')
  if (choice) {
    // Do buy logic, remove item from available and add to player's inventory.
    return console.log(choice)
  } else {
    return console.log(choice)
  }
}

function useFlow(i : ItemType) {
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
        @click="item.owner == '' ? buyFlow(item) : useFlow(item)"/>

        <h2 class="green">{{ item.name }}</h2>
        <h2>Price:</h2>
        <h2 class="green">{{ item.price }}</h2>
    </div>
  </div>
</template>

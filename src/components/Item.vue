<script setup lang="ts">
defineProps<{
  item: {
    itemid: string, 
    name: string, 
    price: string, 
    owner: string, 
    health: string, 
    rarity: string, 
    image: string 
}
}>()

function log(i : string) {
  return console.log("clicked " + i)
}
</script>

<template>
  <div class="item-container box" @click="log(item.name)">
    <div class="item-info">
        <img :src="'/src/assets/testItems/' + item.image + '.jpg'" :alt="'an image of ' + item.name" class="item-image"/>

        <h2 class="green">{{ item.name }}</h2>
        <h2>Price:</h2>
        <h2 class="green">{{ item.price }}</h2>
    </div>
  </div>
</template>

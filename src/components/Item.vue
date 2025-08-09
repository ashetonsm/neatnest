<script setup lang="ts">
import type { ItemType } from '@/assets/ItemExports';

defineProps<{
  item: ItemType
}>()

function log(i : string) {
  return console.log("clicked " + i)
}
</script>

<template>
  <div class="item-container box">
    <div class="item-info">
        <img :src="'/src/assets/testItems/' + item.image + '.jpg'" 
        :alt="'an image of ' + item.name" class="item-image"
        @click="log(item.name)"/>

        <h2 class="green">{{ item.name }}</h2>
        <h2>Price:</h2>
        <h2 class="green">{{ item.price }}</h2>
    </div>
  </div>
</template>

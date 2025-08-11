<script setup lang="ts">
import type { ItemType } from '@/assets/ItemExports';
import Item from './Item.vue';
import { testItems } from '@/assets/testData/itemObjectList.ts';
import { useRoute } from 'vue-router';
// These should be items that are freely in the pool for this shop

const route = useRoute()

// Determine shop name based on number from route
var shopFrontName = route.params.id == "1" ? "Test Emporium" : "Test Shack"

var items = testItems.filter(function (item: ItemType) {
  return item.owner == '' &&
    item.shopfront == shopFrontName 
});


</script>

<template>
  <div class="page-header">
    <h1>{{ shopFrontName }}</h1>
  </div>
  <p>This is where you shop for things.</p>
  <div class="page" id="shopPage">

  <template v-if="!items">
    <h1>Loading!</h1>
  </template>
  <template v-else-if="!items.length">
    <h1>This shop is sold out!</h1>
  </template>
  <template v-else>
    <Item v-for="(item, i) in items" :key=item.name :item=item />
  </template>
  </div>
</template>

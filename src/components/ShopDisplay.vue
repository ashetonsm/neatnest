<script setup lang="ts">
import type { ItemType } from '@/assets/ItemExports';
import Item from './Item.vue';
import { testItems } from '@/assets/testData/itemObjectList.ts';
// These should be items that are freely in the pool for this shop

var items = testItems.filter(function (item: ItemType) {
  return item.owner == '' &&
    item.shopfront == 'Test Emporium'
});

</script>

<template>

  <template v-if="!items">
    <h1>Loading!</h1>
  </template>
  <template v-else-if="!items.length">
    <h1>This shop is sold out!</h1>
  </template>
  <template v-else>
    <Item v-for="(item, i) in items" :key=item.name :item=item />
  </template>
</template>

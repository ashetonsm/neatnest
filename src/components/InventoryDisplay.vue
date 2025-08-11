<script setup lang="ts">
import type { ItemType } from '@/assets/ItemExports';
import Item from './Item.vue';
import { testItems } from '@/assets/testData/itemObjectList.ts';
// These should be items where the owner is the logged in user

var items = testItems.filter(function (item: ItemType) {
  return item.owner == 'nnneato'
});

</script>

<template>
    <div class="page-header">
      <h1>Your Inventory</h1>
      <p>This is where you view your inventory.</p>
    </div>
  <div class="page" id="inventoryPage">
    <template v-if="!items">
      <h1>Loading!</h1>
    </template>
    <template v-else-if="!items.length">
      <h1>Your inventory is empty</h1>
    </template>
    <template v-else>
      <Item v-for="(item, i) in items" :key=item.name :item=item />
    </template>
  </div>
</template>

<script setup lang="ts">
import Item from './Item.vue';

const items = [
    {
        itemid: '0', 
        name: 'Rubber Duck', 
        price: '5', 
        owner: '', 
        health: '100', 
        rarity: '0', 
        image: 'rubberduck'
    },
    {
        itemid: '1', 
        name: 'Rainbow Cake', 
        price: '55', 
        owner: '', 
        health: '100', 
        rarity: '1', 
        image: 'cake'
    },
    {
        itemid: '2', 
        name: 'White Shirt', 
        price: '15', 
        owner: '', 
        health: '100', 
        rarity: '0', 
        image: 'whiteshirt'
    },
]

</script>

<template>

  <template v-if="!items">
    <h1>Loading!</h1>
  </template>
  <template v-else-if="!items.length">
    <h1>No items found</h1>
  </template>
  <template v-else>
    <Item v-for="(item, i) in items" :key=item.name :item=item />
  </template>
</template>

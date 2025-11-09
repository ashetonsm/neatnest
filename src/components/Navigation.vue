<script setup lang="ts">
import { RouterLink } from "vue-router";

var links = [
  { title: "Home", name: "/" },
  { title: "Shop 1", name: "/shop/1" },
  { title: "Shop 2", name: "/shop/2" },
  { title: "Inventory", name: "/inventory" },
  { title: "Profile", name: "/profile" },
  { title: "Pets", name: "/pets" },
  { title: "About", name: "/about" },
];
</script>

<template>
  <nav>
    <RouterLink v-for="(link, i) in links" :key="link.title" :to="link.name">{{
      link.title
    }}</RouterLink>
  </nav>
</template>

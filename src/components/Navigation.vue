<script setup lang="ts">
import { userStore } from "@/stores/user";
import { onMounted, ref } from "vue";
import { RouterLink } from "vue-router";

const myProfile = ref("");

const links = ref<Array<{ title: string; name: string }>>([
  { title: "Home", name: "/" },
  { title: "Shop 1", name: "/shop/1" },
  { title: "Shop 2", name: "/shop/2" },
  { title: "Inventory", name: "/inventory" },
  { title: "Profile", name: `/profile/null` },
  { title: "Pets", name: "/pets" },
  { title: "About", name: "/about" },
]);

const store = userStore();

onMounted(async () => {
  store.$subscribe((mutation, state) => {
    // Perform actions here when the state changes

    if (mutation.storeId == "user") {
      const un = store.getUser.username;
      myProfile.value = un.toString();

      links.value = [
        { title: "Home", name: "/" },
        { title: "Shop 1", name: "/shop/1" },
        { title: "Shop 2", name: "/shop/2" },
        { title: "Inventory", name: "/inventory" },
        { title: "Profile", name: `/profile/${myProfile.value}` },
        { title: "Pets", name: "/pets" },
        { title: "About", name: "/about" },
      ];
    }
  });
});
</script>

<template>
  <nav>
    <RouterLink v-for="(link, i) in links" :key="link.title" :to="link.name">{{
      link.title
    }}</RouterLink>
  </nav>
</template>

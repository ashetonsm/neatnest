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
        { title: "The Emporium", name: "/shop/1" },
        { title: "The Shack", name: "/shop/2" },
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
    <v-app-bar>
      <v-container class="d-flex align-center py-0">
        <v-app-bar-title class="pl-0">
          <div class="d-flex align-center">
            <v-avatar
              alt="NeatNest logo"
              class="me-3"
              image="@/assets/logo.svg"
              rounded="0"
            />
            NeatNest
          </div>
        </v-app-bar-title>

        <v-spacer />

        <RouterLink v-for="(link, i) in links" :key="link.title" :to="link.name">
          <v-list-item width="max-content">
            {{ link.title }}
          </v-list-item>
        </RouterLink>
      </v-container>
    </v-app-bar>
  </nav>
</template>

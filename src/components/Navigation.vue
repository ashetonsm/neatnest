<script setup lang="ts">
import { userStore } from "@/stores/user";
import { onMounted, ref } from "vue";
import { RouterLink } from "vue-router";

const user = userStore();

const loggedOutLinks = ref<Array<{ title: string; name: string }>>([
  { title: "Home", name: "/" },
  { title: "General Store", name: "/shop/1" },
  { title: "Inventory", name: "/inventory" },
  { title: "Pets", name: "/pets" },
  { title: "About", name: "/about" },
]);

const loggedInLinks = ref<Array<{ title: string; name: string }>>([
  { title: "Home", name: "/" },
  { title: "General Store", name: "/shop/1" },
  { title: "Inventory", name: "/inventory" },
  {
    title: "Profile",
    name: ``,
  },
  { title: "Pets", name: "/pets" },
  { title: "About", name: "/about" },
]);

onMounted(async () => {
  user.$subscribe((mutation) => {
    // Perform actions here when the state changes
    console.log("Nav's user: ", user.getUser?.username);

    if (mutation.storeId == "user" && user.getUser?.username !== undefined) {
      loggedInLinks.value[3].name = `/profile/${user.getUser?.username}`;
    }
  });
});
</script>

<template>
  <v-app-bar>
    <v-container class="d-flex align-center">
      <v-app-bar-title>
        <div class="d-flex align-center">
          <v-avatar alt="NeatNest logo" class="me-3" image="@/assets/logo.svg" />
          NeatNest
        </div>
      </v-app-bar-title>

      <v-spacer />

      <template v-if="user.getUser">
        <RouterLink v-for="(link, i) in loggedInLinks" :key="link.title" :to="link.name">
          <v-btn width="max-content" :key="i" :value="link.name" color="primary">
            {{ link.title }}
          </v-btn>
        </RouterLink>
      </template>
      <template v-else>
        <RouterLink v-for="(link, i) in loggedOutLinks" :key="link.title" :to="link.name">
          <v-btn width="max-content" :key="i" :value="link.name" color="primary">
            {{ link.title }}
          </v-btn>
        </RouterLink>
      </template>
    </v-container>
  </v-app-bar>
</template>

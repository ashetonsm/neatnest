<script setup lang="ts">
import { RouterView } from "vue-router";
import "@aws-amplify/ui-vue/styles.css";
import Navigation from "./components/Navigation.vue";
import { userStore } from "./stores/user";
const store = userStore();
</script>

<template>
  <v-app>
    <v-main>
      <Navigation />
      <RouterView :key="$route.fullPath" />
      <button @click="() => console.log('signout')">Sign Out</button>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { RouterView } from "vue-router";
import { Authenticator } from "@aws-amplify/ui-vue";
import "@aws-amplify/ui-vue/styles.css";
import Navigation from "./components/Navigation.vue";
import { userStore } from "./stores/user";
const store = userStore();
</script>

<template>
  <main>
    <v-app>
      <Navigation />
      <v-container fluid>
        <RouterView :key="$route.fullPath" />
        <button @click="() => console.log('signout')">Sign Out</button>
      </v-container>
    </v-app>
  </main>
</template>

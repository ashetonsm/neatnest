<script setup lang="ts">
import { RouterView } from "vue-router";
import { Authenticator } from "@aws-amplify/ui-vue";
import "@aws-amplify/ui-vue/styles.css";
import Navigation from "./components/Navigation.vue";
import { userStore } from "./stores/user";
const store = userStore();
</script>

<template>
  <img
    alt="NeatNest logo"
    class="logo"
    src="@/assets/logo.svg"
    width="125"
    height="125"
  />
  <main>
    <v-app>
      <h1 v-if="store.getUser">Hello, {{ store.getUser.username }}</h1>
      <h1 v-else="!store.getUser">Hello. Please sign in.</h1>
      <Navigation />
      <RouterView :key="$route.fullPath" />
      <button @click="() => console.log('signout')">Sign Out</button>
    </v-app>
  </main>
</template>

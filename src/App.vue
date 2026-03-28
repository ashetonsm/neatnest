<script setup lang="ts">
import { RouterView } from "vue-router";
import Navigation from "./components/Navigation.vue";
import router from "@/router";
</script>

<template>
  <v-app>
    <v-main>
      <v-container>
        <Navigation />
        <RouterView :key="$route.fullPath" />
      </v-container>
      <v-btn>
        Log Out
      </v-btn>
      <v-btn to="/login">Log in</v-btn>
    </v-main>
  </v-app>
</template>

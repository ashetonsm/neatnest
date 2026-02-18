<script setup lang="ts">
import { RouterView } from "vue-router";
import "@aws-amplify/ui-vue/styles.css";
import Navigation from "./components/Navigation.vue";
import { signOut } from "aws-amplify/auth";
import router from "@/router";
</script>

<template>
  <v-app>
    <v-main>
      <v-container>
        <Navigation />
        <RouterView :key="$route.fullPath" />
      </v-container>
      <v-btn
        @click="
          async () => {
            await signOut().then(() => {
              router.go(0);
            });
          }
        "
      >
        Log Out
      </v-btn>
      <v-btn to="/login">Log in</v-btn>
    </v-main>
  </v-app>
</template>

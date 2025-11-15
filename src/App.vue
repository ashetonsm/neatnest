<script setup lang="ts">
import { RouterView } from "vue-router";
import { Authenticator } from "@aws-amplify/ui-vue";
import "@aws-amplify/ui-vue/styles.css";
import Navigation from "./components/Navigation.vue";
</script>

<template>
  <img alt="NeatNest logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />
  <main>
    <Authenticator>
      <template v-slot="{ user, signOut }">
        <h1 v-if="user">Hello, {{ user.signInDetails.loginId }}</h1>
        <h1 v-else="!user">Hello. Please sign in.</h1>
        <Navigation />
        <RouterView :key="$route.fullPath" />
        <button @click="signOut">Sign Out</button>
      </template>
    </Authenticator>
  </main>
</template>

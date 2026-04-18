<script setup lang="ts">
import { RouterView } from "vue-router";
import Navigation from "./components/Navigation.vue";
import router from "@/router";
import { useAuth0 } from "@auth0/auth0-vue";

const { loginWithRedirect, logout: auth0Logout } = useAuth0();
const logout = () => {
  document.cookie = "currentUser=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"; 
  auth0Logout({ logoutParams: { returnTo: window.location.origin } })
}

</script>

<template>
  <v-app>
    <v-main>
      <v-container>
        <Navigation />
        <RouterView :key="$route.fullPath" />
      </v-container>
      <v-btn @click="logout"> Log Out </v-btn>
      <v-btn @click="loginWithRedirect({ appState: { target: '/callback' } })">Log in</v-btn>
    </v-main>
  </v-app>
</template>

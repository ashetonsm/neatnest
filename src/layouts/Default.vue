<script setup lang="ts">
import { RouterView } from "vue-router";
import Navigation from "@/components/Navigation.vue";
import { useAuth0 } from "@auth0/auth0-vue";
import { userStore } from "@/stores/user";

const user = userStore()
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
      <v-container class="d-flex align-center justify-center text-center mx-auto pa-8">
        <v-btn v-if="user.getUser" @click="logout" color="secondary"> Log Out </v-btn>
        <v-btn v-if="!user.getUser" @click="loginWithRedirect({ appState: { target: '/callback' } })" color="primary">Log in</v-btn>
      </v-container>
    </v-main>
  </v-app>
</template>

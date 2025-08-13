<script setup lang="ts">
import { RouterView } from 'vue-router'
import Header from './components/Header.vue';
import { Authenticator } from '@aws-amplify/ui-vue';
import "@aws-amplify/ui-vue/styles.css";
import { Amplify } from 'aws-amplify';
import Navigation from './components/Navigation.vue';

const links = [
  { title: 'Home', name: '/' },
  { title: 'Login', name: '/login' },
  { title: 'Shop 1', name: '/shop/1' },
  { title: 'Shop 2', name: '/shop/2' },
  { title: 'Inventory', name: '/inventory' },
  { title: 'Profile', name: '/profile' },
  { title: 'Pets', name: '/pets' },
  { title: 'About', name: '/about' },
]

</script>

<template>
  <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />
          <RouterView :key="$route.fullPath"/>

  <!-- <Authenticator>
    <template v-slot="{user, signOut}">
      <header>
        <div class="wrapper">
        <Header :user=user.username />
      <Navigation/>
    </div>
  </header>

      
      <main>
        <RouterView :key="$route.fullPath"/>
        <button @click="signOut">Sign Out</button>
      </main>
    </template>
  </Authenticator> -->
</template>

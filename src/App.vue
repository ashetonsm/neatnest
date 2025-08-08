<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import Header from './components/Header.vue';

const links = [
  { title: 'Home', name: '/' },
  { title: 'Login', name: 'login' },
  { title: 'Shop', name: 'shop' },
  { title: 'Inventory', name: 'inventory' },
  { title: 'Profile', name: 'profile' },
  { title: 'Pets', name: 'pets' },
  { title: 'About', name: 'about' },
]


</script>

<template>
  <header>
    <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />

    <div class="wrapper">
      <Header msg="Neat Nest" />

      <nav>
        <RouterLink v-for="(link, i) in links" :key=link.title :to=link.name>{{link.title}}</RouterLink>
      </nav>
    </div>
  </header>

  <main>
    <RouterView />
  </main>
</template>

<script setup lang="ts">
defineProps<{
  msg: string
}>()
</script>

<template>
  <div class="greetings">
    <h1 class="green">{{ msg }}</h1>
    <h3>
      Welcome to
      <a href="https://vite.dev/" target="_blank" rel="noopener">Neat</a>
      <a href="https://vuejs.org/" target="_blank" rel="noopener">Nest</a>. What's next?
    </h3>
  </div>
</template>


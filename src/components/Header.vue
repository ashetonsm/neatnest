<script setup lang="ts">
defineProps<{
  user: String;
}>();
</script>

<template>
  <div class="greetings">
    <h1 class="green">
      <span v-if="user"> Hello, {{ user }} </span>
      <span v-else="!user"> Hello! </span>
    </h1>
    <h3>Welcome to Neat Nest.</h3>
  </div>
</template>

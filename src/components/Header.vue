<script setup lang="ts">
import { useAuthStore } from '@/stores/auth.store';


const auth = useAuthStore();
const user = auth.user

</script>

<template>
  <div class="greetings">
    <h1 class="green">
      <span v-if="auth.user">
        Hello, {{ auth.user.username }}
      </span>
      <span v-else="!auth.user">
        Hello!
      </span>
    </h1>
    <h3>
      Welcome to Neat Nest.
    </h3>
  </div>
</template>


<script setup lang="ts">
import { Authenticator } from "@aws-amplify/ui-vue";
</script>

<template>
  <Authenticator>
    <template v-slot="{ user, signOut }">
      <h1>Hello {{ user.username }}!</h1>
    </template>
  </Authenticator>
</template>

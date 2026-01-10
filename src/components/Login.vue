<script setup lang="ts">
import { Authenticator } from "@aws-amplify/ui-vue";
import router from "@/router";
</script>

<template>
  <Authenticator>
    {{ router.push({ name: "home" }) }}
  </Authenticator>
</template>

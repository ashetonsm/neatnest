<script setup lang="ts">
import { userStore } from "../stores/user";
import { useAuth0 } from "@auth0/auth0-vue";

const uStore = userStore();
const { user } = useAuth0();

if (!uStore.getUser) {
  await uStore.fetchUser(user.value?.sub as string, "#METADATA#", user).then(() => {
    console.log("Got the logged in uStore's Metadata in Callback: ", uStore.getUser);
  });
}
</script>

<template>
  <h1>Setting the store...</h1>
</template>

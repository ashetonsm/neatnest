<script setup lang="ts">
import router from "@/router";
import { userStore } from "../stores/user";
import { useAuth0 } from "@auth0/auth0-vue";

const uStore = userStore();
const { user } = useAuth0();

if (!uStore.getUser) {
  await uStore.fetchUser(user.value?.sub as string, "#METADATA", user).then(() => {
    console.log("Got the logged in uStore's Metadata in Callback: ", uStore.getUser);
    setCookie(uStore.getUser.PK, 1)
    router.push({name: 'pets'});
  });
}

function setCookie(cvalue: string, exdays: number) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  let expires = "expires=" + d.toUTCString();
  document.cookie = "currentUser=" + cvalue + ";" + expires + ";path=/";
}


</script>

<template>
  <h1>Logging in...</h1>
</template>

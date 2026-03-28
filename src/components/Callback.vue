<script setup lang="ts">
import router from "@/router";
import { userStore } from "../stores/user";

const user = userStore();

await user.fetchUser("user000", "#METADATA#")
    .then((res) => {
        console.log(res)
    })

</script>

<template>
  <h1>Setting the store...</h1>
</template>

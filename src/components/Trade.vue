<script setup lang="ts">
import { onMounted, ref } from "vue";
import type { Schema } from "../../amplify/data/resource";

const petData = ref<Schema["Pet"]["type"] | any>("")

const props = defineProps<{
  trade: Schema["Trade"]["type"];
  pet: Schema["Pet"]["type"] | any;
}>();

onMounted(async () => {
  console.log(props.trade)
  petData.value = await JSON.parse(props.pet) as Schema["Pet"]["type"]
  console.log(petData.value)
})


async function handleTrade(t: Schema["Trade"]["type"], action: string) {
  const choice = confirm(`${action} this trade?`);
  if (choice) {
    switch (action) {
      case "accept":
        console.log("Accept trade.");
        console.log(t);
        break;
      case "reject":
        console.log("Reject trade.");
        console.log(t);
        break;
      default:
        console.log("Invalid trade action.");
        break;
    }
    // Refresh
    // router.go(0);
  } else {
    return console.log(`Trade aborted.`);
  }
}
</script>

<template>
  <v-card class="mx-auto" max-width="300px">
    <v-card-title class="text-center">{{ new Date(props.trade.createdAt) }}</v-card-title>
    <v-card-subtitle>{{ `Trade between ${props.trade.sender} and ${props.trade.recipient}` }}</v-card-subtitle>
    
          <h3>Name: {{ petData.name }}</h3>
    <!-- <v-card-actions v-if="trade.owner == user.getUser?.id && route.name == 'trades'"> -->
      <v-btn
        @click="handleTrade(props.trade, 'accept')"
        text="Accept"
        class="mx-auto"
        variant="elevated"
        color="success"
      ></v-btn>
      <v-btn
        @click="handleTrade(props.trade, 'reject')"
        text="Reject"
        class="mx-auto"
        variant="elevated"
        color="error"
      ></v-btn>
    <!-- </v-card-actions> -->
  </v-card>
</template>

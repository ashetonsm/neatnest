<script setup lang="ts">
import { onMounted, ref, shallowRef, toRaw } from "vue";
import { userStore } from "@/stores/user";
import Pet from "../Pet.vue";

const props = defineProps<{
  trade: any;
}>();

const textStatus = ref("")

async function handleTrade(action: string) {
  console.log(toRaw(props.trade.tradeContents[0]))
}

onMounted(() => {
  console.log(props.trade.status)
  switch (parseInt(props.trade.status)) {
    case 0:
      textStatus.value = "Waiting on You"
      break;
    case 1:
      textStatus.value  = "Accepted"
      break;
    case 2:
      textStatus.value  = "Rejected"
      break;
    case 8:
      textStatus.value  = "Closed"
      break;
    case 9:
      textStatus.value  = "Waiting on Them"
      break;
  
    default:
      textStatus.value  = "Invalid trade status!"
      break;
  } 
})

</script>

<template>
  <v-card class="mx-auto" max-width="300px">
    <v-card-title class="text-center">{{ new Date(props.trade.createdAt).toUTCString() }}</v-card-title>
    <v-card-subtitle>{{
      `Trade between ${props.trade.username} and ${props.trade.tradeUsername}`
    }}</v-card-subtitle>

    <h3>Pet(s): {{ toRaw(props.trade.tradeContents[0]).length }}</h3>
          <v-card 
            class="mx-auto" max-width="200px"
            v-for="(pet, i) in props.trade.tradeContents[0]"
            :key="pet.name ?? i">
            <v-card-title>{{ pet.name }}</v-card-title>
            <v-card-subtitle>{{ pet.creator }}</v-card-subtitle>
          </v-card>
    <h3>Item(s): {{ toRaw(props.trade.tradeContents[1]).length }}</h3>
          <v-card 
            class="mx-auto" max-width="200px"
            v-for="(item, i) in props.trade.tradeContents[1]"
            :key="item.name ?? i">
            <v-card-title>{{ item.name }}</v-card-title>
            <v-card-subtitle>{{ item.creator }}</v-card-subtitle>
          </v-card>
    <h3>Credits:</h3>
          <v-card 
            class="mx-auto" max-width="200px">
            <v-card-title>{{ toRaw(props.trade.tradeContents[2].credits) }}</v-card-title>
          </v-card>
    <h3>Trade Status: {{ textStatus }}</h3>
    <v-card-actions>
      <v-btn
        @click="handleTrade('accept')"
        text="Accept"
        class="mx-auto"
        variant="elevated"
        color="success"
      ></v-btn>
      <v-btn
        @click="handleTrade('reject')"
        text="Reject"
        class="mx-auto"
        variant="elevated"
        color="error"
      ></v-btn>
      <v-btn
        @click="handleTrade('cancel')"
        text="Cancel"
        class="mx-auto"
        variant="elevated"
        color="error"
      ></v-btn>
    </v-card-actions>
  </v-card>
</template>

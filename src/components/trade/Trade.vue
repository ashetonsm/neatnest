<script setup lang="ts">
import { onMounted, ref, shallowRef, toRaw } from "vue";
import TradeButtons from "./TradeButtons.vue";
import { userStore } from "@/stores/user";
import {
  UPDATE_TRADE
} from "@/components/tools/ddbActions";
import router from "@/router";

const props = defineProps<{
  trade: any;
}>();

const user = userStore();
const textStatus = ref("")
const buttonValues = ref({
  cancel: false,
  accept: false,
  reject: false
})

async function handleTrade(action: string) {
  var traderObj = { PK: '', tradeUsername: '' }
  traderObj.PK = (props.trade.SK).match(/(?<=#)\S+/)[0]
  traderObj.tradeUsername = props.trade.tradeUsername

  await UPDATE_TRADE(traderObj, user.getUser, toRaw(props.trade.tradeContents), action)
  .then(() => {
      router.push({name: 'trades'})
      router.go(0);
  })
}

onMounted(() => {
  switch (parseInt(props.trade.status)) {
    case 0:
      textStatus.value = "Waiting on You"
      buttonValues.value.accept = true
      buttonValues.value.reject = true
      break;
    case 1:
      textStatus.value = "Accepted"
      break;
    case 2:
      textStatus.value = "Rejected"
      break;
    case 8:
      textStatus.value = "Closed"
      break;
    case 9:
      textStatus.value = "Waiting on Them"
      buttonValues.value.cancel = true
      break;

    default:
      textStatus.value = "Invalid trade status!"
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

    <h3>Pet(s): {{ toRaw(props.trade.tradeContents[0].pets).length }}</h3>
    <v-card v-if="toRaw(props.trade.tradeContents[0].pets).length !== 0" class="mx-auto" max-width="200px"
      v-for="(pet, i) in props.trade.tradeContents[0].pets" :key="pet.name ?? i">
      <v-card-title>{{ pet.name }}</v-card-title>
      <v-card-subtitle>{{ pet.creator }}</v-card-subtitle>
    </v-card>
    <v-card v-else class="mx-auto" max-width="200px">
      <v-card-title>No pets</v-card-title>
    </v-card>
    <h3>Item(s):</h3>
    <v-card v-if="toRaw(props.trade.tradeContents[1].items).length > 0" class="mx-auto" max-width="200px"
      v-for="(item, i) in props.trade.tradeContents[1].items" :key="item.name ?? i">
      <v-card-title>{{ item.name }}</v-card-title>
      <v-card-subtitle>{{ item.creator }}</v-card-subtitle>
    </v-card>
    <v-card v-else class="mx-auto" max-width="200px">
      <v-card-title>No items</v-card-title>
    </v-card>
    <h3>Credits:</h3>
    <v-card class="mx-auto" max-width="200px">
      <v-card-title>{{ toRaw(props.trade.tradeContents[2].credits) }}</v-card-title>
    </v-card>
    <h3>Trade Status: {{ textStatus }}</h3>
    <v-card-actions>
      <TradeButtons :buttonValues="buttonValues" :updateTrade="handleTrade" />
    </v-card-actions>
  </v-card>
</template>

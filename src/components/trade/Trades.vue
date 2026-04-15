<script setup lang="ts">
import { onMounted, ref } from "vue";
import { userStore } from "@/stores/user";
import Trade from "@/components/trade/Trade.vue";
import CreateTrade from "@/components/trade/CreateTrade.vue"
const user = userStore();

const trades = ref<Array<any>>([]);
const friends = ref<Array<any>>(user.getFriends);

onMounted(async () => {
  if (user.getTrades.length == 0) {
    trades.value = await user.fetchTrades() || []
  }
  if (user.getFriends.length == 0) {
    friends.value = await user.fetchFriends(user.getUser.PK) || []
  }
})

</script>

<template>
  <v-sheet
    class="d-flex align-center justify-center text-center mx-auto pa-8"
    elevation="4"
    width="100%"
    rounded
  >
  <v-row>
      <CreateTrade />
      <v-col md="12" class="text-center">
        <h2 class="text-h4 font-weight-black ma-4">Your Trades</h2>


        <v-alert
          v-if="!trades"
          title="Loading..."
          type="info"
          class="ma-4"
        ></v-alert>
        <v-alert
          v-else-if="!trades.length"
          title="No trade history found!"
          type="info"
          class="ma-4"
        ></v-alert>

        <v-row class="ga-4">
          <Trade
            v-for="(trade, i) in trades"
            :key="trade?.id ?? i"
            :trade="trade"
            :pet="trade.pet as any"
          />
        </v-row>
      </v-col>
    </v-row>
  </v-sheet>
</template>

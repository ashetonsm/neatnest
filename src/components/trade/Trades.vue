<script setup lang="ts">
import { onMounted, ref } from "vue";
import { userStore } from "@/stores/user";
import CreateTrade from "@/components/trade/CreateTrade.vue"
import Trade from "@/components/trade/Trade.vue"
const user = userStore();
const trades = ref<any>();


async function getTrades() {
  const data = await user.fetchTrades()
  if (data) {
    return data
  } else {
    return []
  }
}

onMounted(async () => {
  trades.value = await getTrades()
  // console.log(trades.value)
})

</script>

<template>
  <v-sheet class="d-flex align-center justify-center text-center mx-auto pa-8" elevation="4" width="100%" rounded>
    <v-row>
      <CreateTrade />
      <v-col md="12" class="text-center">
        <h2 class="text-h4 font-weight-black ma-4">Your Trades</h2>

        <v-alert v-if="!trades" title="No trade history found!" type="info" class="ma-4"></v-alert>

        <!-- User has 1 trade and it is an object-->
        <template v-if="trades">
          <Trade v-if="trades.tradeContents" key="trade 1" :trade="trades" />
          <v-row v-if="trades.length > 0" class="ga-4">
            <Trade v-for="(trade, i) in trades" :key="trade?.PK ?? i" :trade="trade" />
          </v-row>
        </template>
      </v-col>
    </v-row>
  </v-sheet>
</template>

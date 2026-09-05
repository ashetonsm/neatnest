<script setup lang="ts">
import { onMounted, ref } from "vue";
import { userStore } from "@/stores/user";
import CreateTrade from "@/components/trade/CreateTrade.vue"
import Trade from "@/components/trade/Trade.vue"
const user = userStore();
const trades = ref<Array<any>>([]);


async function getTrades() {
  const data = await user.fetchTrades()
  console.log("Trades data", data)
  if (data) {
    if (data.length) {
      return data
    } else {
      return [data]
    }
  } else {
    return []
  }
}

onMounted(async () => {
    trades.value = await getTrades()
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
          v-else-if="!trades.values.length"
          title="No trade history found!"
          type="info"
          class="ma-4"
        ></v-alert>

        <v-row class="ga-4">
          <Trade
            v-if="trades.values.length > 0"
            v-for="(trade, i) in trades"
            :key="trade?.PK ?? i"
            :trade="trade"
          />
        </v-row>
      </v-col>
    </v-row>
  </v-sheet>
</template>

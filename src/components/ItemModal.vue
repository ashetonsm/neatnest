<script setup lang="ts">
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../amplify/data/resource";
import { userStore } from "@/stores/user";

const client = generateClient<Schema>();
const user = userStore();

const props = defineProps<{
  item: Schema["Item"]["type"];
}>();

async function toggleSell(i: Schema["Item"]["type"], action: string) {
    console.log("Item to be sold: ", i)
    console.log("Item action: ", action)
}
</script>
<template>
  <v-card class="mx-auto">
    <v-col class="text-center">
      <v-card-title>What would you like to do with "{{ item.name }}"?</v-card-title>
    <v-card-actions>
      <v-btn
        @click="item.shopId !== user.getShop?.ownerId ? toggleSell(item, 'add') : toggleSell(item, 'remove')"
        :text="item.shopId !== user.getShop?.ownerId ? 'Add to Shop' : 'Remove from Shop'"
        class="mx-auto"
        variant="elevated"
        color="primary"
      ></v-btn>
    </v-card-actions>

    </v-col>
  </v-card>
</template>

<script setup lang="ts">
import Item from "./Item.vue";
import { useRoute } from "vue-router";
import { onMounted, ref } from "vue";
import { generateClient } from "aws-amplify/api";
import type { Schema } from "../../amplify/data/resource";
import { userStore } from "@/stores/user";

// These should be items that are freely in the pool for this shop
const store = userStore();
const route = useRoute();

// TODO: Determine shop name based on number from route
var shopFrontName = route.params.id == "1" ? "Test Emporium" : "Test Shack";
const client = generateClient<Schema>();
const fetchedItems = ref<Array<Schema["Item"]["type"]>>([]);

async function fetchItems() {
  const { data: items } = await client.models.Item.listItemsByShopfrontAndOwner(
    {
      shopfront: shopFrontName,
      owner: {
        eq: "NA",
      },
    },
    {
      authMode: "userPool",
    }
  );
  fetchedItems.value = items;
}

onMounted(async () => {
  await fetchItems();
});
</script>

<template>
  <v-sheet
    class="d-flex align-center justify-center text-center mx-auto pa-8"
    elevation="4"
    width="100%"
    rounded
  >
    <v-row>
      <v-col md="12" class="text-center">
        <h2 class="text-h4 font-weight-black ma-4">Welcome to {{ shopFrontName }}!</h2>

        <v-alert
          v-if="!fetchedItems"
          title="Loading..."
          type="info"
          class="ma-4"
        ></v-alert>
        <v-alert
          v-else-if="!fetchedItems.length"
          title="This shop is sold out!"
          type="info"
          class="ma-4"
        ></v-alert>
      </v-col>

      <v-row class="ga-4">
        <Item
          v-if="fetchedItems.length !== 0"
          v-for="(item, i) in fetchedItems"
          :key="item.name ?? i"
          :item="item"
          :currentUser="store.getUser.id"
        />
      </v-row>
    </v-row>
  </v-sheet>
</template>

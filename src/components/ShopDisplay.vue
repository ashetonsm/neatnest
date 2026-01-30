<script setup lang="ts">
import Item from "./Item.vue";
import { useRoute } from "vue-router";
import { onMounted, ref } from "vue";
import { generateClient } from "aws-amplify/api";
import type { Schema } from "../../amplify/data/resource";
import { userStore } from "@/stores/user";

// These should be items that are freely in the pool for this shop
const user = userStore();
const route = useRoute();

// TODO: Determine shop name based on number from route
const client = generateClient<Schema>();
const fetchedItems = ref<Array<Schema["Item"]["type"]>>([]);

async function fetchItems() {
  try {
    const { data: items } = await client.models.Item.listItemsByShopIdAndOwner(
      {
        shopId: route.params.id.toString(),
        ownerId: {
          ne: user.getUser?.id
        },
      },
      {
        authMode: "userPool",
      }
    );
    fetchedItems.value = items;
  } catch (error: any) {
    console.log("No items found!")
  }
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
        <h2 class="text-h4 font-weight-black ma-4">Welcome to {{ route.params.id.toString() }}'s shop!</h2>

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
          :currentUser="user.getUser?.id!"
        />
      </v-row>
    </v-row>
  </v-sheet>
</template>

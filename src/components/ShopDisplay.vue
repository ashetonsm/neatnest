<script setup lang="ts">
import Item from "./Item.vue";
import { onMounted, ref, toRaw } from "vue";
import { userStore } from "@/stores/user";
import { useRoute } from "vue-router";

// These should be items where the owner is the logged in user
const user = userStore();
const route = useRoute();
var shopkeeper = route.params.id;

// create a reactive reference to Item[]
const fetchedItems: any = ref<Array<any>>([]);

onMounted(async () => {
  fetchedItems.value = await toRaw(user.fetchShop(shopkeeper as string))
  console.log("fetchedItems.value:", fetchedItems.value)
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
        <h2 class="text-h4 font-weight-black ma-4"></h2>

        <v-alert
          v-if="fetchedItems.length == 0"
          title="This shop is empty!"
          type="info"
          class="ma-4"
        ></v-alert>

        <v-row class="ga-4">
          <Item
            v-if="fetchedItems.length !== 0"
            v-for="(item, i) in fetchedItems"
            :key="item.name ?? i"
            :item="item"
            :currentUser="user.getUser?.PK!"
          />
        </v-row>
      </v-col>
    </v-row>
  </v-sheet>
</template>

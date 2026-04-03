<script setup lang="ts">
import { userStore } from "@/stores/user";
import router from "@/router";
import { PUT_DATA } from "./tools/ddbActions";

const user = userStore();

const props = defineProps<{
  item: any;
}>();

async function toggleSell(i: any, action: string) {
  var updatedItem = i;
  console.log(i)
  try {
    switch (action) {
      case "add":
        // Change the item to Selling = true
        updatedItem.Selling = true;
        break;

      case "remove":
        updatedItem.Selling = false;
        break;
      default:
        console.log("Invalid action.");
        break;
    }

    await PUT_DATA(updatedItem)
      .then((res: any) => {
        console.log(res);
      })
      .then(() => {
        // Refresh
        router.go(0);
      });
  } catch (error) {
    console.error(error);
  }
}
</script>
<template>
  <v-card class="mx-auto">
    <v-col class="text-center">
      <v-card-title>What would you like to do with "{{ item.name }}"?</v-card-title>
      <v-card-actions>
        <v-btn
          @click="
            item.Selling !== true ? toggleSell(item, 'add') : toggleSell(item, 'remove')
          "
          :text="item.Selling !== true ? 'Add to Shop' : 'Remove from Shop'"
          class="mx-auto"
          variant="elevated"
          color="primary"
        ></v-btn>
      </v-card-actions>
    </v-col>
  </v-card>
</template>

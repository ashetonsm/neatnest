<script setup lang="ts">
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../amplify/data/resource";
import { userStore } from "@/stores/user";
import router from "@/router";

const client = generateClient<Schema>();
const user = userStore();

const props = defineProps<{
  item: Schema["Item"]["type"];
}>();

async function toggleSell(i: Schema["Item"]["type"], action: string) {
  var updatedItem = i;
  var updatedShop = user.getShop!;
  var stringItems = await JSON.parse(updatedShop.items as string);
  var arrayItems = stringItems as Array<Schema["Item"]["type"]>;

  try {
    switch (action) {
      case "add":
        // Change the item's shop ID
        updatedItem.shopId = user.getShop?.id as string;
        // Add the item to the local array of items
        arrayItems.push(i);
        // Change the updatedShop's items
        updatedShop.items = JSON.stringify(arrayItems);
        break;

      case "remove":
        console.log("arrayItems.length", arrayItems.length)
        console.log("remove ID #", i.id)
        // Change the item's shop ID
        updatedItem.shopId = "NA";
        if (arrayItems.length) {
          const items = arrayItems;
          // Filter the items to get rid of the one with the matching ID
          const filteredItems = items.filter(item => 
            (item.id as string) !== (i.id as string)
          );

          console.log("filteredItems after filtering: ", filteredItems);
          // Stringify the filtered items
          updatedShop.items = JSON.stringify(filteredItems);
          if (arrayItems.length === 1) {
            console.log("ArrayItems has one item");
            // Set the array back to empty.
            updatedShop.items = JSON.stringify([]);
          }
        } else {
          console.log("ArrayItems is empty");
          // Do nothing. It's already empty. (This is an error)
        }
        break;
      default:
        console.log("Invalid action.");
        break;
    }
    await client.models.Item.update(updatedItem, { authMode: "userPool" }).then(
      (res: any) => {
        console.log("Updated Item:", res);
      }
    );
    await client.models.Shop.update(updatedShop, { authMode: "userPool" }).then(
      (res: any) => {
        console.log("Updated Shop:", res);
        // Refresh
        router.go(0);
      }
    );
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
            item.shopId !== user.getShop?.id
              ? toggleSell(item, 'add')
              : toggleSell(item, 'remove')
          "
          :text="item.shopId !== user.getShop?.id ? 'Add to Shop' : 'Remove from Shop'"
          class="mx-auto"
          variant="elevated"
          color="primary"
        ></v-btn>
      </v-card-actions>
    </v-col>
  </v-card>
</template>

<script setup lang="ts">
import router from "@/router";
import { useRoute } from "vue-router";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../amplify/data/resource";
import { getUrl } from "aws-amplify/storage";
import { onMounted, ref } from "vue";
import { deleteStorage } from "./tools/deleteStorage";
import { userStore } from "@/stores/user";
import ItemModal from "./ItemModal.vue";
const user = userStore();
const itemModalRef = ref();

const client = generateClient<Schema>(); // use this Data client for CRUDL requests
const signedSrc = ref("null");

const props = defineProps<{
  item: Schema["Item"]["type"];
  currentUser: string;
}>();

async function buyFlow(i: Schema["Item"]["type"]) {
  const choice = confirm("Buy " + i.name + " for " + i.price + "?");
  if (choice) {
    // Have not fetched Credit entry yet
    if (!user.getCredits) {
      await user.fetchCredit();
    }

    // console.log("User has ", user.getCredits.amount, " credit(s).");
    if (user.getCredits.amount && i.price && user.getCredits.amount >= i.price) {
      var updatedCredit = user.getCredits;
      updatedCredit.amount = updatedCredit.amount - i.price;

      // Subtract the amount.
      await client.models.Credit.update(updatedCredit).then(async () => {
        // Set the owner to the signed in user
        i.ownerId = props.currentUser;
        // Update the item to the current user
        await client.models.Item.update(i).then(() => {});
        // Refresh
        router.go(0);
      });
    } else {
      alert("You don't have enough credits to buy this!");
    }
  } else {
    return console.log(choice);
  }
}

async function getFileUrl(fileName: any) {
  try {
    const result = await getUrl({
      path: fileName, // Adjust path as needed (e.g., private/, protected/)
      options: {
        expiresIn: 3600, // URL valid for 1 hour
        validateObjectExistence: true,
      },
    });
    signedSrc.value = result.url.toString();
  } catch (error) {
    console.error("Error getting URL:", error);
    return null;
  }

  return;
}

async function handleDelete(i: Schema["Item"]["type"]) {
  const choice = confirm("Delete " + i.name + "?");
  if (choice) {
    // Do delete logic
    // Delete the item
    await client.models.Item.delete({ id: i.id })
      .then((res: any) => {
        console.log("Item deleted: ", res);
      })
      .then(async () => {
        await deleteStorage(i.image!);
      });
    // Refresh
    router.go(0);
  } else {
    return console.log("Deletion aborted.");
  }
}

onMounted(async () => {
  await getFileUrl(props.item.image);
});
</script>

<template>
  <v-dialog
    v-if="item.ownerId == user.getUser?.id && $route.name == 'inventory'"
    :activator="itemModalRef"
    max-width="500"
  >
    <item-modal :item="item" v-slot:default="{ isActive }" />
  </v-dialog>
  
  <v-card 
  class="mx-auto" 
  max-width="300px"
  :color="item.shopId == user.getShop?.id ? 'light-green-lighten-5' : 'none'"
  >
    <v-img
      ref="itemModalRef"
      :src="signedSrc"
      :alt="'an image of ' + item.name"
      :class="item.ownerId == 'NA' ? 'cursor-pointer' : 'cursor-default'"
      class="cursor-pointer"
      min-width="150px"
      max-width="300px"
    ></v-img>

    <v-card-title class="text-center"
    >
      {{ item.name }}
    </v-card-title>
    <v-card-subtitle v-if="item.ownerId != props.currentUser">
      Price: {{ item.price }}
    </v-card-subtitle>
    <template>
    
    </template v-if="item.ownerId == props.currentUser">
    <v-card-subtitle v-if="item.shopId == user.getShop?.id">
      Selling
    </v-card-subtitle>

    <v-card-actions v-if="item.ownerId == props.currentUser">
      <v-btn
        @click="handleDelete(item)"
        text="Obliterate"
        class="mx-auto"
        variant="elevated"
        color="error"
      ></v-btn>
    </v-card-actions>
  </v-card>
</template>

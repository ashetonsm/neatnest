<script setup lang="ts">
import router from "@/router";
import { useRoute } from "vue-router";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../amplify/data/resource";
import { getUrl } from "aws-amplify/storage";
import { onMounted, ref } from "vue";
import { deleteStorage } from "./tools/deleteStorage";
import { userStore } from "@/stores/user";
const route = useRoute();
const store = userStore();

var shopFrontName = route.params.id == "1" ? "Test Emporium" : "Test Shack";
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
    if (!store.getCredits) {
      await store.fetchCredit();
    }

    // console.log("User has ", store.getCredits.amount, " credit(s).");
    if (store.getCredits.amount && i.price && store.getCredits.amount >= i.price) {
      var updatedCredit = store.getCredits;
      updatedCredit.amount = updatedCredit.amount - i.price;

      // Subtract the amount.
      await client.models.Credit.update(updatedCredit).then(async () => {
        // Set the owner to the signed in user
        i.owner = props.currentUser;
        // Update the item to the current user
        await client.models.Item.update(i).then((res) => {});
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
  <v-card class="mx-auto" max-width="300px">
    <v-img
      :src="signedSrc"
      :alt="'an image of ' + item.name"
      @click="item.owner == 'NA' ? buyFlow(item) : null"
      :class="item.owner == 'NA' ? 'cursor-pointer' : 'cursor-default'"
      class="cursor-pointer"
      min-width="150px"
      max-width="300px"
    ></v-img>

    <v-card-title class="text-center">
      {{ item.name }}
    </v-card-title>
    <v-card-subtitle v-if="item.owner != props.currentUser">
      Price: {{ item.price }}
    </v-card-subtitle>

    <v-card-actions v-if="item.owner == props.currentUser">
      <v-btn @click="handleDelete(item)" text="Delete" class="mx-auto"></v-btn>
    </v-card-actions>
  </v-card>
</template>

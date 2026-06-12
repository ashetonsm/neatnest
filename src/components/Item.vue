<script setup lang="ts">
import router from "@/router";
import { onMounted, ref, toRaw } from "vue";
import { userStore } from "@/stores/user";
import ItemModal from "./ItemModal.vue";
import { createPresignedUrlWithClient, DELETE_S3 } from "@/components/tools/s3Actions";
import { DELETE_DATA, GET_BY_PK_SK, PUT_DATA } from "./tools/ddbActions";
const user = userStore();
const itemModalRef = ref();

const signedSrc = ref("null");
const itemCreator = ref("Loading...");

const props = defineProps<{
  item: any;
  currentUser: string;
}>();

async function buyFlow(i: any) {
  const choice = confirm("Buy " + i.name + " for " + i.price + "?");
  if (choice) {
    console.log("User has ", user.getCredits, " credit(s).");
    if (user.getCredits >= i.price) {
      // Subtract the amount. It doesn't matter if we clone this or not.
      var updatedUser = user.getUser
      updatedUser.credits -= i.price
      await PUT_DATA(updatedUser)
      
      // Create the item with a clone.
      var boughtItem = structuredClone(toRaw(i))
      // Modify the owner and selling status
      boughtItem.PK = user.getUser.PK
      boughtItem.owner = user.getUser.PK
      boughtItem.selling = false

      // Write it to the DB
      await PUT_DATA(boughtItem)
      // Delete the old item
      await DELETE_DATA(toRaw(i))
      .then(() => {
        router.go(0);
      })
    } else {
      alert("You don't have enough credits to buy this!");
    }
  } else {
    return console.log(choice);
  }
}

async function getFileUrl(fileName: any) {
  try {
    const result = await createPresignedUrlWithClient(fileName as string);
    console.log(result);
    signedSrc.value = result;
  } catch (error) {
    console.error(error);
    return null;
  }

  return;
}

async function handleDelete(i: any) {
  const choice = confirm("Delete " + i.name + "?");
  if (choice) {
    // Do delete logic
    await DELETE_S3(i).then(() => {
      console.log("Image deleted.");
    });
    await DELETE_DATA(i).then(async () => {
      console.log("DynamoDB data deleted.");
    })
      .then(() => {
        // Refresh
        router.go(0);
      })
  } else {
    return console.log("Deletion aborted.");
  }
}

onMounted(async () => {
  await getFileUrl(props.item.url);
  const creatorMetadata = await toRaw(GET_BY_PK_SK(props.item.creator, "#METADATA"))
  itemCreator.value = creatorMetadata?.username
});
</script>

<template>
  <v-dialog v-if="item.owner == user.getUser?.PK && $route.name == 'inventory'" :activator="itemModalRef"
    max-width="500">
    <item-modal :item="item" v-slot:default="{ isActive }" />
  </v-dialog>

  <v-card class="mx-auto" max-width="300px"
    :color="item.selling && $route.name == 'inventory' ? 'light-green-lighten-5' : 'none'">
    <v-img 
      ref="itemModalRef" 
      :src="signedSrc" 
      :alt="'an image of ' + item.name"
      :class="(item.owner == 'NA' || item.owner != user.getUser.PK) ? 
      'cursor-pointer' : 
      'cursor-default'" 
      class="cursor-pointer" 
      min-width="150px"
      max-width="300px"></v-img>

    <v-card-title class="text-center">
      {{ item.name }}
    </v-card-title>
    <!-- Display the creator and price regardless of the screen -->
    <v-card-subtitle> Creator: {{ itemCreator }} </v-card-subtitle>
    <v-card-subtitle> Price: {{ item.price }} </v-card-subtitle>

    <!-- Viewing the currentUser's shop -->
    <template v-if="$route.path == `/shop/${user.getUser.username}` && item.owner == user.getUser.PK">
      <v-card-subtitle v-if="item.selling"> 🛒 </v-card-subtitle>
      <v-card-actions>
        <v-btn
          @click="handleDelete(item)"
          :disabled="true"
          text="Erase"
          class="mx-auto"
          variant="elevated"
          color="error"
        >This is your shop!</v-btn>
      </v-card-actions>
    </template>
    
    <!-- Viewing the currentUser's inventory -->
    <template v-if="$route.name == 'inventory' && item.owner == user.getUser.PK">
      <v-card-subtitle v-if="item.selling"> 🛒 </v-card-subtitle>      
      <v-card-actions>
        <v-btn
        @click="handleDelete(item)"
        text="Erase"
        class="mx-auto"
        variant="elevated"
        color="error"
        ></v-btn>
      </v-card-actions>
    </template>
    <template v-if="item.owner != user.getUser.PK">
      <v-card-actions>
        <v-btn
          @click="buyFlow(item)"
          text="Buy"
          class="mx-auto"
          variant="elevated"
          color="success"
        ></v-btn>
      </v-card-actions>
    </template>
  </v-card>
</template>

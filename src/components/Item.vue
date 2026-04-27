<script setup lang="ts">
import router from "@/router";
import { onMounted, ref } from "vue";
import { userStore } from "@/stores/user";
import ItemModal from "./ItemModal.vue";
import { createPresignedUrlWithClient, DELETE_S3 } from "@/components/tools/s3Actions";
import { DELETE_DATA, PUT_DATA } from "./tools/ddbActions";
const user = userStore();
const itemModalRef = ref();

const signedSrc = ref("null");

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
      var boughtItem = structuredClone(i)
      // Modify the owner and selling status
      boughtItem.owner = user.getUser.PK
      boughtItem.selling = false
      // Write it to the DB
      await PUT_DATA(boughtItem)

      // Delete the old item
      await DELETE_DATA(i)
      
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
  await getFileUrl(props.item.image);
});
</script>

<template>
  <v-dialog v-if="item.owner == user.getUser?.PK && $route.name == 'inventory'" :activator="itemModalRef"
    max-width="500">
    <item-modal :item="item" v-slot:default="{ isActive }" />
  </v-dialog>

  <v-card class="mx-auto" max-width="300px"
    :color="item.selling && $route.name == 'inventory' ? 'light-green-lighten-5' : 'none'">
    <v-img ref="itemModalRef" :src="signedSrc" :alt="'an image of ' + item.name"
      :class="item.owner == 'NA' ? 'cursor-pointer' : 'cursor-default'" class="cursor-pointer" min-width="150px"
      max-width="300px"></v-img>

    <v-card-title class="text-center">
      {{ item.name }}
    </v-card-title>

    <!-- Items owned by the user and on the inventory page-->
    <template v-if="item.owner == props.currentUser && $route.name == 'inventory'">
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
    <template v-else>
      <v-card-subtitle> Price: {{ item.price }} </v-card-subtitle>

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

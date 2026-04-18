<script setup lang="ts">
import router from "@/router";
import { onMounted, ref } from "vue";
import { userStore } from "@/stores/user";
import ItemModal from "./ItemModal.vue";
import { createPresignedUrlWithClient, DELETE_S3 } from "@/components/tools/s3Actions";
import { DELETE_DATA } from "./tools/ddbActions";
const user = userStore();
const itemModalRef = ref();

const signedSrc = ref("null");

const props = defineProps<{
  item: any;
  currentUser: string;
}>();

async function buyFlow(i: any) {
  const choice = confirm("Buy " + i.name + " for " + i.Price + "?");
  if (choice) {
    // Have not fetched Credit entry yet
    if (!user.getCredits) {
      await user.fetchCredit();
    }

    // const shopItems = await user.fetchShop(i.ownerId as string)
    // console.log(shopItems)

    // console.log("User has ", user.getCredits.amount, " credit(s).");
    if (user.getCredits.amount && i.Price && user.getCredits.amount >= i.Price) {
      var updatedCredit = user.getCredits;
      updatedCredit.amount = updatedCredit.amount - i.Price;

      // Subtract the amount.
      /*
      await client.models.Credit.update(updatedCredit).then(async () => {
        // Set the owner to the signed in user
        i.ownerId = props.currentUser;
        // Update the item to the current user
        await client.models.Item.update(i).then(() => {});
        // Refresh
        router.go(0);
      });
      */
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
  <v-dialog
    v-if="item.owner == user.getUser?.PK && $route.name == 'inventory'"
    :activator="itemModalRef"
    max-width="500"
  >
    <item-modal :item="item" v-slot:default="{ isActive }" />
  </v-dialog>

  <v-card
    class="mx-auto"
    max-width="300px"
    :color="item.Selling && $route.name == 'inventory' ? 'light-green-lighten-5' : 'none'"
  >
    <v-img
      ref="itemModalRef"
      :src="signedSrc"
      :alt="'an image of ' + item.name"
      :class="item.owner == 'NA' ? 'cursor-pointer' : 'cursor-default'"
      class="cursor-pointer"
      min-width="150px"
      max-width="300px"
    ></v-img>

    <v-card-title class="text-center">
      {{ item.name }}
    </v-card-title>

    <!-- Items owned by the user and on the inventory page-->
    <template v-if="item.owner == props.currentUser && $route.name == 'inventory'">
      <v-card-subtitle v-if="item.Selling"> 🛒 </v-card-subtitle>

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
      <v-card-subtitle> Price: {{ item.Price }} </v-card-subtitle>

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

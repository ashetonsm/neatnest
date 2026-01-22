<script setup lang="ts">
import { onMounted, ref } from "vue";
import type { Schema } from "../../amplify/data/resource";
import { userStore } from "@/stores/user";
import { generateClient } from "aws-amplify/api";

const client = generateClient<Schema>();
const petData = ref<Schema["Pet"]["type"] | any>("");
const user = userStore();
const thisFriend = ref<{
  username: string;
  friendObject: Schema["Friend"]["type"];
} | null>(null);

const props = defineProps<{
  trade: Schema["Trade"]["type"];
  pet: Schema["Pet"]["type"] | any;
}>();

onMounted(async () => {
  const friendList = user.getFriends;
  // Get trader usernames
  friendList.filter((f: any) => {
    console.log(f.friendObject.friendB, props.trade.recipient);
    console.log(f.friendObject.friendA, props.trade.recipient);
    (f.friendObject.friendB as string) == (props.trade.recipient as string);
  });
  thisFriend.value = friendList[0];
  petData.value = (await JSON.parse(props.pet)) as Schema["Pet"]["type"];
});

async function handleTrade(t: Schema["Trade"]["type"], action: string) {
  const choice = confirm(`${action} this trade?`);
  if (choice) {
    try {
      var updatedPet = props.pet;
      var updatedTrade = t;
      switch (action) {
        case "accept":
          console.log("Accept trade.");
          // Reassign the pet's owner
          updatedPet.ownerId = user.getUser?.id;
          await client.models.Pet.update(updatedPet)
            .then((res: any) => {
              console.log(res.data);
            })
            .then(() => {
              updatedTrade.status = "completed";
            });
          console.log(t);
          break;
        case "reject":
          console.log("Reject trade.");
          updatedTrade.status = "rejected";

          console.log(t);
          break;
        default:
          console.log("Invalid trade action.");
          break;
      }

      // Set trade status
      await client.models.Trade.update(updatedTrade).then((res: any) => {
        console.log(res.data);
      });

      // Refresh
      // router.go(0);
    } catch (error: any) {
      console.error(error);
    }
  } else {
    return console.log(`Trade aborted.`);
  }
}
</script>

<template>
  <v-card class="mx-auto" max-width="300px">
    <v-card-title class="text-center">{{ new Date(props.trade.createdAt) }}</v-card-title>
    <v-card-subtitle>{{
      `Trade between ${
        props.trade.sender == user.getUser?.id
          ? user.getUser?.username
          : thisFriend?.username
      } and ${
        props.trade.recipient == user.getUser?.id
          ? user.getUser?.username
          : props.trade.recipient
      }`
    }}</v-card-subtitle>

    <h3>Name: {{ petData.name }}</h3>
    <!-- <v-card-actions v-if="trade.owner == user.getUser?.id && route.name == 'trades'"> -->
    <v-btn
      @click="handleTrade(props.trade, 'accept')"
      :disabled="['accepted', 'rejected'].includes(props.trade.status!.toString())"
      text="Accept"
      class="mx-auto"
      variant="elevated"
      color="success"
    ></v-btn>
    <v-btn
      @click="handleTrade(props.trade, 'reject')"
      :disabled="['accepted', 'rejected'].includes(props.trade.status!.toString())"
      text="Reject"
      class="mx-auto"
      variant="elevated"
      color="error"
    ></v-btn>
    <!-- </v-card-actions> -->
  </v-card>
</template>

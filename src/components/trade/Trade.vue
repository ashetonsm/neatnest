<script setup lang="ts">
import { onMounted, ref, shallowRef } from "vue";
import { userStore } from "@/stores/user";
import router from "@/router";

const petData = shallowRef<any>(null);
const thisFriend = shallowRef<any>(null);
const user = userStore();

const props = defineProps<{
  trade: any;
  pet: any;
}>();

onMounted(async () => {
  if (user.getFriends.length == 0) {

  }
  const friendList = user.getFriends;
  // Get trader usernames
  friendList.filter((f: any) => {
    // console.log(f.friendObject.friendB, props.trade.recipient);
    // console.log(f.friendObject.friendA, props.trade.recipient);
    (f.friendObject.friendA as string) == (props.trade.recipient as string) ||
      (f.friendObject.friendB as string) == (props.trade.recipient as string) ||
      (f.friendObject.friendA as string) == (props.trade.sender as string) ||
      (f.friendObject.friendB as string) == (props.trade.sender as string);
  });
  thisFriend.value = friendList[0];
  petData.value = (await JSON.parse((props.pet as unknown) as string)) as any;
});

async function handleTrade(t: any, action: string) {
  var updatedPet = petData.value;
  if (updatedPet) {
    console.log("The petData.value:", petData.value);
    // console.log("The pet to be updated:", updatedPet)
    // console.log("The pet's owner':", updatedPet?.ownerId)
    console.log("Your Id:", user.getUser?.id);
    // console.log("The trade:", t)
    const choice = confirm(`${action} this trade?`);
    if (choice) {
      try {
        var updatedTrade = t;
        switch (action) {
          case "accept":
            console.log("Accept trade.");
            // Reassign the pet's owner. This is done successfully.
            updatedPet.ownerId = user.getUser?.id;

            console.log("Updated pet ID:", updatedPet.id);
            console.log("Updated pet:", updatedPet);
            /*
            await client.models.Pet.update(updatedPet)
              .then((res: any) => {
                console.log(res.data);
              })
              .then(() => {
                updatedTrade.status = "accepted";
              });
              */
            break;
          case "reject":
            console.log("Reject trade.");
            updatedTrade.status = "rejected";
            break;
          case "cancel":
            console.log("Cancel trade.");
            updatedTrade.status = "cancelled";
            break;
          default:
            console.log("Invalid trade action.");
            break;
        }

        console.log("The trade id: ", updatedTrade.id);
        console.log("The trade status: ", updatedTrade.status);
        // Set trade status
        /*
        await client.models.Trade.update(updatedTrade).then((res: any) => {
          console.log(res.data);
        });
        */

        // Refresh
        router.go(0);
      } catch (error: any) {
        console.error(error);
      }
    } else {
      return console.log(`Trade aborted.`);
    }
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

    <h3>Pet Name: {{ petData?.name }}</h3>
    <h3>Trade Status: {{ props.trade.status }}</h3>
    <v-card-actions>
      <v-btn
        @click="handleTrade(props.trade, 'accept')"
        :disabled="['accepted', 'rejected', 'cancelled'].includes(props.trade.status!.toString()) || props.trade.owner == user.getUser?.id"
        text="Accept"
        class="mx-auto"
        variant="elevated"
        color="success"
      ></v-btn>
      <v-btn
        @click="handleTrade(props.trade, 'reject')"
        :disabled="['accepted', 'rejected', 'cancelled'].includes(props.trade.status!.toString()) || props.trade.owner == user.getUser?.id"
        text="Reject"
        class="mx-auto"
        variant="elevated"
        color="error"
      ></v-btn>
      <v-btn
        v-if="props.trade.owner == user.getUser?.id && !['accepted', 'rejected', 'cancelled'].includes(props.trade.status!.toString())"
        @click="handleTrade(props.trade, 'cancel')"
        text="Cancel"
        class="mx-auto"
        variant="elevated"
        color="error"
      ></v-btn>
    </v-card-actions>
  </v-card>
</template>

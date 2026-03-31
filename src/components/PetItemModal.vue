<script setup lang="ts">
import router from "@/router";
import { onMounted, ref } from "vue";
import { userStore } from "@/stores/user";

const user = userStore();

const props = defineProps<{
  pet: any;
  items: Array<any>;
}>();

async function handleSubmit(item: any | null | undefined) {
  if (item == undefined || !item) {
    alert(`Hmm, nothing was selected.`);
    return;
  }
  const pet = JSON.parse(JSON.stringify(props.pet));
  try {
    var updatedItem = item;
    var updatedPet = pet;
    var itemWillBeDeleted = false;
    updatedItem.health!--;

    if (updatedItem.health! <= 0 || updatedItem.category == "food") {
      itemWillBeDeleted = true;
    }

    // Update the item.
    if (itemWillBeDeleted) {
      var confirmDeletion = confirm("This item will disappear after use. Continue?");
      if (confirmDeletion == true) {
        // Delete the item
        /*
        await client.models.Item.delete({ id: item.id })
          .then((res: any) => {})
          .then(async () => {
            await deleteStorage(item.image!);
          });
          */
      } else {
        // Deletion was not confirmed.
        return;
      }
    } else {
      // Item will not be deleted
      // Subtract 1 from health
      /*
      await client.models.Item.update(updatedItem).then((res: any) => {});
      */
    }

    // Update the pet

    // Mood actions
    if (pet.Mood < 5) {
      // Increment mood by one
      updatedPet.Mood++;
    }
    // Food actions
    if (item.Category == "food") {
      if (pet.Hunger > 0) {
        // decrease hunger by one
        updatedPet.Hunger--;
      }
    }

    /*

    await client.models.Pet.update(updatedPet).then((res: any) => {});
    */
    router.go(0);
  } catch (error: any) {
    console.error("Error: ", error);
  }
}

async function handleTrade(
  friend: { username: string; friendObject: any } | null | undefined
) {
  if (friend == undefined || !friend) {
    alert(`Hmm, nothing was selected.`);
    return;
  }
  try {
    /*
    
        await client.models.Trade.create({
          recipient: friend.friendObject.friendA! !== user.getUser!.id ? friend.friendObject.friendA : friend.friendObject.friendB,
          sender: user.getUser?.id,
          status: "pending",
          pet: JSON.stringify(props.pet),
        }).then((res: any) => {
          console.log(res);
        });
        router.go(0);
        */
  } catch (error: any) {
    console.error("Error: ", error);
  }
}

var foodOptions = ref<Array<any>>();
var playOptions = ref<Array<any>>();
var selectedFoodOption = ref<any>();
var selectedPlayOption = ref<any>();
var selectedFriendOption = ref<any>();
var friendOptions = ref<Array<{ username: string; friendObject: any }>>(user.getFriends);
const itemFilter1 = props.items;
const itemFilter2 = props.items;
foodOptions.value = JSON.parse(
  JSON.stringify(itemFilter1.filter((item) => item.Category == "food"))
);
playOptions.value = JSON.parse(
  JSON.stringify(itemFilter2.filter((item) => item.Category == "entertainment"))
);
</script>
<template>
  <v-card class="mx-auto">
    <v-col class="text-center">
      <v-card-title> What would you like to do with {{ pet.Name }}? </v-card-title>
      <v-form
        v-if="friendOptions.length !== 0"
        @submit.prevent="handleTrade(selectedFriendOption as any)"
      >
        <v-select
          v-model="selectedFriendOption"
          label="Friends"
          :items="friendOptions"
          item-title="username"
          item-value="friendOptions.friendObject"
          return-object
          single-line
        ></v-select>
        <v-btn class="my-2" text="Trade" type="submit"></v-btn>
      </v-form>
      <v-form @submit.prevent="handleSubmit(selectedFoodOption as any)">
        <v-select
          v-model="selectedFoodOption"
          label="Food"
          :items="foodOptions"
          item-title="name"
          item-value="selectedFoodOption"
          return-object
          single-line
        ></v-select>
        <v-btn class="my-2" text="Feed" type="submit"></v-btn>
      </v-form>
      <v-form @submit.prevent="handleSubmit(selectedPlayOption as any)">
        <v-select
          v-model="selectedPlayOption"
          label="Entertainment"
          :items="playOptions"
          item-title="name"
          item-value="selectedPlayOption"
          return-object
          single-line
        ></v-select>
        <v-btn class="my-2" text="Play" type="submit"></v-btn>
      </v-form>
    </v-col>
  </v-card>
</template>

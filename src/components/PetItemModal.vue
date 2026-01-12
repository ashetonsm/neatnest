<script setup lang="ts">
import router from "@/router";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../amplify/data/resource";
import { onMounted, ref } from "vue";
import { deleteStorage } from "./tools/deleteStorage";
import { userStore } from "@/stores/user";

const client = generateClient<Schema>();
const user = userStore();

const props = defineProps<{
  pet: Schema["Pet"]["type"];
  items: Array<Schema["Item"]["type"]>;
}>();

async function handleSubmit(item: Schema["Item"]["type"] | null | undefined) {
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
        await client.models.Item.delete({ id: item.id })
          .then((res: any) => {})
          .then(async () => {
            await deleteStorage(item.image!);
          });
      } else {
        // Deletion was not confirmed.
        return;
      }
    } else {
      // Item will not be deleted
      // Subtract 1 from health
      await client.models.Item.update(updatedItem).then((res: any) => {});
    }

    // Update the pet

    // Mood actions
    if (pet.mood < 5) {
      // Increment mood by one
      updatedPet.mood++;
    }
    // Food actions
    if (item.category == "food") {
      if (pet.hunger > 0) {
        // decrease hunger by one
        updatedPet.hunger--;
      }
    }

    await client.models.Pet.update(updatedPet).then((res: any) => {});
    router.go(0);
  } catch (error: any) {
    console.error("Error: ", error);
  }
}

async function handleTrade(
  friend: { username: string; friendObject: Schema["Friend"]["type"] } | null | undefined
) {
  if (friend == undefined || !friend) {
    alert(`Hmm, nothing was selected.`);
    return;
  }
  const pet = JSON.parse(JSON.stringify(props.pet));
  try {
    var updatedPet = pet;
    // Update the pet
    updatedPet.owner = user.getUser?.id;
    await client.models.Pet.update(updatedPet).then((res: any) => {});
    router.go(0);
  } catch (error: any) {
    console.error("Error: ", error);
  }
}

var foodOptions = ref<Array<Schema["Item"]["type"]>>();
var playOptions = ref<Array<Schema["Item"]["type"]>>();
var selectedFoodOption = ref<Schema["Item"]["type"]>();
var selectedPlayOption = ref<Schema["Item"]["type"]>();
var selectedFriendOption = ref<Schema["Friend"]["type"]>();
const friendOptions = user.getFriends as ref<
  Array<{ username: string; friendObject: Schema["Friend"]["type"] }>
>;
const itemFilter1 = props.items;
const itemFilter2 = props.items;
foodOptions.value = JSON.parse(
  JSON.stringify(itemFilter1.filter((item) => item.category == "food"))
);
playOptions.value = JSON.parse(
  JSON.stringify(itemFilter2.filter((item) => item.category == "entertainment"))
);
</script>
<template>
  <v-card class="mx-auto">
    <v-col class="text-center">
      <v-card-title> What would you like to do with {{ pet.name }}? </v-card-title>
      <v-form
        v-if="friendOptions.length !== 0"
        @submit.prevent="handleTrade(selectedFriendOption)"
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
      <v-form @submit.prevent="handleSubmit(selectedFoodOption)">
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
      <v-form @submit.prevent="handleSubmit(selectedPlayOption)">
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

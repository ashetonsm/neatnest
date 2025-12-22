<script setup lang="ts">
import router from "@/router";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../amplify/data/resource";
import { onMounted, ref } from "vue";
import { deleteStorage } from "./tools/deleteStorage";

const client = generateClient<Schema>();

const props = defineProps<{
  pet: Schema["Pet"]["type"];
  items: Array<Schema["Item"]["type"]>;
}>();

async function handleSubmit(item: Schema["Item"]["type"]) {
  if (item.name == undefined) {
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

var foodOptions = ref<Array<Schema["Item"]["type"]>>();
var playOptions = ref<Array<Schema["Item"]["type"]>>();
var selectedFoodOption = ref("");
var selectedPlayOption = ref("");

onMounted(async () => {
  const itemFilter1 = props.items;
  const itemFilter2 = props.items;
  foodOptions.value = JSON.parse(
    JSON.stringify(itemFilter1.filter((item) => item.category == "food"))
  );
  playOptions.value = JSON.parse(
    JSON.stringify(itemFilter2.filter((item) => item.category == "entertainment"))
  );
});
</script>
<template>
  <div class="info">
    <h1>What would you like to do with {{ pet.name }}?</h1>
  </div>
  <h2>Feed</h2>
  <select v-model="selectedFoodOption">
    <option disabled value="">Please select one</option>
    <option v-for="item in foodOptions" :value="item">
      {{ item.name }}
    </option>
  </select>
  <button @click="handleSubmit(JSON.parse(JSON.stringify(selectedFoodOption)))">
    Do it!
  </button>

  <h2>Play</h2>
  <select v-model="selectedPlayOption">
    <option disabled value="">Please select one</option>
    <option v-for="item in playOptions" :value="item">
      {{ item.name! }}
    </option>
  </select>
  <button @click="handleSubmit(JSON.parse(JSON.stringify(selectedPlayOption)))">
    Do it!
  </button>
</template>

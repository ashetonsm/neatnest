<script setup lang="ts">
import router from "@/router";
import { ref, toRaw } from "vue";
import { userStore } from "@/stores/user";
import { DELETE_S3 } from "./tools/s3Actions";
import { BATCH_MODIFY_DATA, DELETE_DATA, PUT_DATA } from "./tools/ddbActions";

const user = userStore()
const props = defineProps<{
  pet: any;
  items: Array<any>;
}>();

async function handleSubmit(item: any | null | undefined) {
  if (item == undefined || !item) {
    alert(`Hmm, nothing was selected.`);
    return;
  }
  const pet = props.pet
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
        // Do delete logic
        await DELETE_S3(item)
        await DELETE_DATA(item)
      } else {
        return;
      }
    } else {
      await PUT_DATA(updatedItem);
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
    await PUT_DATA(updatedPet);
    router.go(0);
  } catch (error: any) {
    console.error("Error: ", error);
  }
}

async function handleStatus() {
  try { 
      var petPutList: { PutRequest: { Item: any; }; }[] = []
      // const allPets = user.getPets
      user.getPets.filter((pet: { status: number; name: any; }) => {
        if (pet.status == 0 && pet.name == props.pet.name) {
          pet.status = 1
        } else {
          pet.status = 0
        }
        petPutList.push({ PutRequest: { Item: toRaw(pet) } });
        })

        console.log("petPutList", petPutList)
      await BATCH_MODIFY_DATA(petPutList)
        .then((res) => {
          console.log(res)
          router.go(0);
        })
    } catch (error: any) {
      console.error("Error: ", error);
    }
  }

var foodOptions = ref<Array<any>>();
var playOptions = ref<Array<any>>();
var selectedFoodOption = ref<any>();
var selectedPlayOption = ref<any>();
const itemFilter1 = props.items;
const itemFilter2 = props.items;
foodOptions.value = itemFilter1.filter((item) => item.category == "food"
);
playOptions.value = itemFilter2.filter((item) => item.category == "entertainment"
);
</script>
<template>
  <v-card class="mx-auto">
    <v-col class="text-center">
      <v-card-title> What would you like to do with {{ pet.name }}? </v-card-title>

        <v-btn
          :color='props.pet.status == 1 ? "error" : "primary"'
          @click="handleStatus()"
          class="mb-4"
          >{{props.pet.status == 1 ? "Set Inactive" : "Set Active"}}
        </v-btn>


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

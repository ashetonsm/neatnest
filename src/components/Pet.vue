<script setup lang="ts">
import { onMounted, ref } from "vue";
import type { Schema } from "../../amplify/data/resource";
import { getUrl } from "aws-amplify/storage";
import PetItemModal from "./PetItemModal.vue";
import { userStore } from "@/stores/user";
import { generateClient } from "aws-amplify/api";
import { deleteStorage } from "./tools/deleteStorage";
import router from "@/router";
import { useRoute } from "vue-router";

const route = useRoute();
const signedSrc = ref("null");
const petModalRef = ref();
const user = userStore();
const client = generateClient<Schema>(); // use this Data client for CRUDL requests

const props = defineProps<{
  pet: Schema["Pet"]["type"];
  items: Array<Schema["Item"]["type"]>;
}>();

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

async function handleDelete(pet: Schema["Item"]["type"]) {
  const choice = confirm(`Delete ${pet.name} forever? (This cannot be undone!)`);
  if (choice) {
    // Do delete logic
    // Delete the pet
    await client.models.Pet.delete({ id: pet.id })
      .then((res: any) => {
        console.log("Pet deleted: ", res);
      })
      .then(async () => {
        await deleteStorage(pet.image!);
      });
    // Refresh
    router.go(0);
  } else {
    return console.log(`${pet.name} was not deleted!`);
  }
}

onMounted(async () => {
  await getFileUrl(props.pet.image);
});
</script>

<template>
  <v-dialog
    v-if="user.getUser?.id! == pet.owner"
    :activator="petModalRef"
    max-width="500"
  >
    <PetItemModal :pet="pet" :items="items" v-slot:default="{ isActive }" />
  </v-dialog>

  <v-card class="mx-auto" max-width="300px">
    <v-img
      ref="petModalRef"
      :src="signedSrc"
      :alt="'an image of ' + pet.name"
      class="cursor-pointer"
      min-width="150px"
      max-width="300px"
    ></v-img>

    <v-card-title class="text-center">
      {{ pet.name }}
    </v-card-title>
    <v-card-subtitle> Hunger: {{ pet.hunger }} </v-card-subtitle>
    <v-card-subtitle> Mood: {{ pet.mood }} </v-card-subtitle>

    <v-card-actions v-if="pet.owner == user.getUser?.id && route.name == 'pets'">
      <v-btn @click="handleDelete(pet)" text="Obliterate" class="mx-auto"></v-btn>
    </v-card-actions>
  </v-card>
</template>

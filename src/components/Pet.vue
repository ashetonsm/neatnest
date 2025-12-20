<script setup lang="ts">
import { onMounted, ref } from "vue";
import type { Schema } from "../../amplify/data/resource";
import { getUrl } from "aws-amplify/storage";
import PetItemModal from "./PetItemModal.vue";

const open = ref(false);
const signedSrc = ref("null");

const props = defineProps<{
  pet: Schema["Pet"]["type"];
  items: Array<Schema["Item"]["type"]>;
}>();

const toggleModal = (n: boolean) => {
  open.value = n;
  return open;
};

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

onMounted(async () => {
  await getFileUrl(props.pet.image);
});
</script>

<template>
  <div v-if="open == true">
    <PetItemModal :pet="pet" :items="items" @open="toggleModal(false)" />
  </div>

  <v-card class="mx-auto" max-width="344">
    <v-img
      :src="signedSrc"
      :alt="'an image of ' + pet.name"
      @click="toggleModal(true)"
      class="cursor-pointer"
    ></v-img>

    <v-card-title class="text-center">
      {{ pet.name }}
    </v-card-title>
    <v-card-subtitle> Hunger: {{ pet.hunger }} </v-card-subtitle>
    <v-card-subtitle> Mood: {{ pet.mood }} </v-card-subtitle>

    <!-- <v-card-actions v-if="item.owner == props.currentUser">
      <v-btn @click="handleDelete(item)" text="Delete" class="mx-auto"></v-btn>
    </v-card-actions> -->
  </v-card>
</template>

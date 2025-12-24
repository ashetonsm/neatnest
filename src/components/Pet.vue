<script setup lang="ts">
import { onMounted, ref } from "vue";
import type { Schema } from "../../amplify/data/resource";
import { getUrl } from "aws-amplify/storage";
import PetItemModal from "./PetItemModal.vue";
import { userStore } from "@/stores/user";

const signedSrc = ref("null");
const petModalRef = ref();
const store = userStore();

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

onMounted(async () => {
  await getFileUrl(props.pet.image);
});
</script>

<template>
  <v-dialog v-if="store.getUser.id == pet.owner" :activator="petModalRef" max-width="500">
    <PetItemModal :pet="pet" :items="items" v-slot:default="{ isActive }" />
  </v-dialog>

  <v-card class="mx-auto" max-width="344">
    <v-img
      ref="petModalRef"
      :src="signedSrc"
      :alt="'an image of ' + pet.name"
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

<script setup lang="ts">
import { onMounted, ref } from "vue";
import PetItemModal from "./PetItemModal.vue";
import { userStore } from "@/stores/user";
import router from "@/router";
import { useRoute } from "vue-router";
import { createPresignedUrlWithClient, DELETE_S3 } from "./tools/s3Actions";
import { DELETE_DATA } from "./tools/ddbActions";

const route = useRoute();
const signedSrc = ref("null");
const petModalRef = ref();
const user = userStore();

const props = defineProps<{
  pet: any;
  items: Array<any>;
}>();

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

async function handleDelete(pet: any) {
  const choice = confirm(`Delete ${pet.Name} forever? (This cannot be undone!)`);
  if (choice) {
    // Do delete logic
    await DELETE_S3(pet).then(() => {
      console.log("Image deleted.");
    });
    await DELETE_DATA(pet)
      .then(async () => {
        console.log("DynamoDB data deleted.");
      })
      .then(() => {
        // Refresh
        router.go(0);
      });
  } else {
    return console.log(`${pet.Name} was not deleted!`);
  }
}

onMounted(async () => {
  await getFileUrl(props.pet.Image);
});
</script>

<template>
  <v-dialog
    v-if="pet.Owner == user.getUser?.PK && route.name == 'pets'"
    :activator="petModalRef"
    max-width="500"
  >
    <PetItemModal :pet="pet" :items="items" v-slot:default="{ isActive }" />
  </v-dialog>

  <v-card class="mx-auto" max-width="300px">
    <v-img
      ref="petModalRef"
      :src="signedSrc"
      :alt="'an image of ' + pet.Name"
      class="cursor-pointer"
      min-width="150px"
      max-width="300px"
    ></v-img>

    <v-card-title class="text-center">
      {{ pet.Name }}
    </v-card-title>
    <v-card-subtitle> Hunger: {{ pet.Hunger }} </v-card-subtitle>
    <v-card-subtitle> Mood: {{ pet.Mood }} </v-card-subtitle>

    <v-card-actions v-if="pet.Owner == user.getUser?.PK && route.name == 'pets'">
      <v-btn
        @click="handleDelete(pet)"
        text="Erase"
        class="mx-auto"
        variant="elevated"
        color="error"
      ></v-btn>
    </v-card-actions>
  </v-card>
</template>

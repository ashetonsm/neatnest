<script setup lang="ts">
import { onMounted, ref, toRaw } from "vue";
import PetItemModal from "./PetItemModal.vue";
import { userStore } from "@/stores/user";
import { useRoute, useRouter } from "vue-router";
import { DELETE_OBJECT, GET_SIGNED_URL } from "./tools/s3Actions";
import { DELETE_DATA, GET_BY_PK_SK } from "./tools/ddbActions";

const route = useRoute();
const router = useRouter();
const signedSrc = ref();
const petModalRef = ref();
const petCreator = ref("Loading...");
const user = userStore();

const props = defineProps<{
  pet: any;
  items: Array<any>;
}>();

async function getFileUrl(fileName: any) {
  await GET_SIGNED_URL(fileName)
  .then((res) => {
    signedSrc.value = res.body
  })
  return
}

async function handleDelete(pet: any) {
  const choice = confirm(`Delete ${pet.name} forever? (This cannot be undone!)`);
  if (choice) {
    // Do delete logic
    await DELETE_OBJECT(pet)
    await DELETE_DATA(pet)
      .then(() => {
        // Refresh
        router.go(0);
      });
  } else {
    return
  }
}

onMounted(async () => {
  await getFileUrl(props.pet.url)
  const creatorMetadata = await toRaw(GET_BY_PK_SK(props.pet.creator, "#METADATA"))
  petCreator.value = creatorMetadata?.username
});
</script>

<template>
  <v-dialog
    v-if="pet.owner == user.getUser?.PK && route.name == 'pets'"
    :activator="petModalRef"
    max-width="500"
  >
    <PetItemModal :pet="pet" :items="items" v-slot:default="{ isActive }" />
  </v-dialog>

  <v-card class="mx-auto" max-width="300px"
    :color="pet.status == 1 && $route.name == 'pets' ? 'light-green-lighten-5' : 'none'">
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
    <v-card-subtitle> Creator: {{ petCreator }} </v-card-subtitle>

    <v-card-actions v-if="pet.owner == user.getUser?.PK && route.name == 'pets'">
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

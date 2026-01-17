<script setup lang="ts">
import { ref } from "vue";
import type { Schema } from "../../amplify/data/resource";
import { getUrl } from "aws-amplify/storage";
import { userStore } from "@/stores/user";
import { generateClient } from "aws-amplify/api";
import { useRoute } from "vue-router";

const route = useRoute();
const signedSrc = ref("null");
const petModalRef = ref();
const user = userStore();
const client = generateClient<Schema>(); // use this Data client for CRUDL requests

const props = defineProps<{
  trade: Schema["Trade"]["type"];
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

</script>

<template>

  <v-card class="mx-auto" max-width="300px">
    <v-card-title class="text-center">
    </v-card-title>
    <v-card-subtitle></v-card-subtitle>

    <v-card-actions v-if="trade.owner == user.getUser?.id && route.name == 'pets'">

    </v-card-actions>
  </v-card>
</template>

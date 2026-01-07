<script setup lang="ts">
import { userStore } from "@/stores/user";
import { createItem } from "./tools/createItem";
import { createPet } from "./tools/createPet";
import { generateClient } from "aws-amplify/api";
import type { Schema } from "amplify/data/resource";
import { ref } from "vue";

var name: string | null;
var speciesName: string | null;
var selectedItemType = ref("");
var itemTypes: Array<string> = ["food", "entertainment"];
const store = userStore();
const client = generateClient<Schema>();

const props = defineProps<{
  thing: string | null;
}>();

async function handleSubmit() {
  const path = `images/${store.getUser?.id!}/${props.thing}/${name}.png`;

  switch (props.thing) {
    case "item":
      console.log("Name: ", name);
      console.log("SelectedItemType: ", selectedItemType);
      if (name && selectedItemType) {
        createItem(
          name,
          path,
          selectedItemType.value,
          store.getUser?.id!,
          store.getUser,
          client
        );
      }
      break;
    case "pet":
      console.log("Name: ", name);
      console.log("SpeciesName: ", speciesName);
      if (name && speciesName) {
        createPet(name, speciesName, path, store.getUser?.id!, store.getUser, client);
      }
      break;

    default:
      console.error("Invalid thing type.");
      break;
  }
}
</script>
<template>
  <v-card class="mx-auto" v-if="props.thing == 'item'">
    <v-col class="text-center">
      <v-card-title>Please name your {{ props.thing }}</v-card-title>
      <v-form @submit.prevent="handleSubmit()">
        <v-text-field v-model="name" label="Item name"></v-text-field>

        <v-select
          v-model="selectedItemType"
          label="Item Type"
          :items="itemTypes"
          item-title="[0]"
          single-line
        ></v-select>
        <v-btn class="my-2" text="Create!" type="submit"></v-btn>
      </v-form>
    </v-col>
  </v-card>

  <v-card class="mx-auto" v-if="props.thing == 'pet'">
    <v-col class="text-center">
      <v-card-title>Please name your {{ props.thing }}</v-card-title>
      <v-form @submit.prevent="handleSubmit()">
        <v-text-field v-model="name" label="Pet name"></v-text-field>
        <v-text-field v-model="speciesName" label="Pet Species"></v-text-field>
        <v-btn class="my-2" text="Create!" type="submit"></v-btn>
      </v-form>
    </v-col>
  </v-card>
</template>

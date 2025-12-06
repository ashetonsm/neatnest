<script setup lang="ts">
import { onMounted, ref } from "vue";
import Canvas from "./Canvas.vue";
import { generateClient } from "aws-amplify/api";
import type { Schema } from "amplify/data/resource";
import { useRoute } from "vue-router";
import { createItem } from "../tools/createItem";
import { createPet } from "../tools/createPet";
import { userStore } from "@/stores/user";
import CreationModal from "../CreationModal.vue";

const client = generateClient<Schema>();
const route = useRoute();
const store = userStore();
const open = ref(false);

const color = ref<string>("rgb(0, 0, 0)");
let thingType = route.params.type.toString();
let thingSpecies: string | null;
var loading = ref<boolean>(true);
var canCreatePet = ref<boolean>(false);
var canCreateItem = ref<boolean>(false);
var lastColor = ref<string>("rgb(0, 0, 0)");

const toggleModal = (n: boolean) => {
  open.value = n;
  return open;
};

function resetCanvas() {
  try {
    const canvas = document.querySelector("canvas");
    if (canvas) {
      const context = canvas.getContext("2d");
      context!.fillStyle = "rgb(255, 255, 255)";
      context!.fillRect(0, 0, canvas.width, canvas.height);
    } else {
      console.log("Canvas not found!");
    }
  } catch (error: any) {
    console.log(error);
  }
}

function handleColor(e: Event) {
  if (e.target) {
    lastColor.value = color.value;
    color.value = (e.target as HTMLInputElement).value.toString();
  }
}

async function handleSubmit(this: any, t: string) {
  switch (t) {
    case "pet":
      toggleModal(true);

      // const thingPath = `images/${store.getUser.id}/${thingType}/${thingName}.png`;
      // createPet(
      //   thingName!,
      //   thingSpecies!,
      //   thingPath!,
      //   store.getUser.id,
      //   store.getUser,
      //   client
      // );
      // alert(`You must set a species name! Please try again.`);
      // alert(`You must name your ${thingType}! Please try again.`);
      break;
    case "item":
      toggleModal(true);

      break;
    default:
      console.log("Invalid route param: ", t);
      return;
  }
}

async function setCreation() {
  if (store.getUser.itemsRemaining! > 0) {
    canCreateItem.value = true;
  }
  if (store.getUser.petsRemaining! > 0) {
    canCreatePet.value = true;
  }
  loading.value = false;
}

onMounted(async () => {
  await setCreation();
});
</script>

<template>
  <div class="page-header">
    <h1>Canvas page</h1>
    <p>This is where you draw on a canvas.</p>
  </div>
  <div class="page" id="canvasPage">
    <template v-if="loading">
      <h1>Loading...</h1>
    </template>
    <template v-if="(!loading && canCreatePet) || canCreateItem">
      <div v-if="open == true">
        <CreationModal @open="toggleModal(false)" :thing="thingType" />
      </div>
      <div class="navbar">
        <div>
          <button @click="resetCanvas">Reset</button>
          <button @click="handleSubmit(route.params.type.toString())">Finish</button>
        </div>
        <div class="container-block">
          <div class="row">
            <h3>Colors:</h3>
          </div>
          <div class="row">
            <div class="column">
              <button
                class="black color"
                value="rgb(0, 0, 0)"
                @click="handleColor($event)"
                style="background-color: rgb(0, 0, 0)"
              ></button>
              Black
            </div>
            <div class="column">
              <button
                class="white color"
                value="rgb(255, 255, 255)"
                @click="handleColor($event)"
                style="background-color: rgb(255, 255, 255)"
              ></button>
              White
            </div>
            <div class="column">
              <button
                id="lastColor"
                class="last color"
                :value="`${lastColor}`"
                @click="handleColor($event)"
                :style="`background-color: ${lastColor}`"
              ></button>
              Last
            </div>
          </div>
        </div>
      </div>
      <div class="container-flex">
        <Canvas :size="24" :color="color"></Canvas>
      </div>
    </template>
    <template v-if="!loading && !canCreatePet && !canCreateItem">
      <h1>Hmm, looks like you can't make anything right now.</h1>
    </template>
  </div>
</template>

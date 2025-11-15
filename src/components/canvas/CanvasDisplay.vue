<script setup lang="ts">
import { onMounted, ref } from "vue";
import Canvas from "./Canvas.vue";
import { generateClient } from "aws-amplify/api";
import type { Schema } from "amplify/data/resource";
import { useRoute } from "vue-router";
import { createItem } from "../tools/createItem";
import { createPet } from "../tools/createPet";
import { userStore } from "@/stores/user";

const client = generateClient<Schema>();
const route = useRoute();
const store = userStore();

const color = ref<string>("rgb(0, 0, 0)");
let thingType = route.params.type;
let thingName: string | null;
var loading = ref<boolean>(true);
var canCreatePet = ref<boolean>(false);
var canCreateItem = ref<boolean>(false);
var lastColor = ref<string>("rgb(0, 0, 0)");

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
  console.log(e.target);
  if (e.target) {
    lastColor.value = color.value;
    color.value = (e.target as HTMLInputElement).value.toString();
  }
}

async function handleSubmit(this: any, t: string) {
  switch (t) {
    case "pet":
      thingName = prompt(`Name your ${t}:`);
      if (thingName) {
        var thingSpecies = prompt(`Give your ${t} a species name:`);
        if (thingSpecies) {
          // Set the path
          const thingPath = `images/${store.getUser.id}/${thingType}/${thingName}.png`;
          createPet(
            thingName!,
            thingSpecies!,
            thingPath!,
            store.getUser.id,
            store.getUser,
            client
          );
        } else {
          alert(`You must set a species name! Please try again.`);
        }
      } else {
        alert(`You must name your ${thingType}! Please try again.`);
      }
      break;
    case "item":
      // Prompt for a name
      thingName = prompt(`Name your ${t}:`);
      // If you get a valid name:
      if (thingName) {
        var itemCategory = prompt(`Is your ${t} food or entertainment?:`);
        if (itemCategory) {
          // Set the path
          const thingPath = `images/${store.getUser.id}/${thingType}/${thingName}.png`;
          createItem(
            thingName,
            thingPath,
            itemCategory,
            store.getUser.id,
            store.getUser,
            client
          );
        } else {
          alert("You must set your item category! Please try again.");
        }
      } else {
        alert(`You must name your ${thingType}! Please try again.`);
      }
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

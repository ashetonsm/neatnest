<script setup lang="ts">
import { onMounted, ref } from "vue";
import Canvas from "./Canvas.vue";
import { useRoute } from "vue-router";
import { userStore } from "@/stores/user";
import CreationModal from "../CreationModal.vue";

const route = useRoute();
const user = userStore();
const createModalRef = ref();

const color = ref<string>("rgb(0, 0, 0)");
let thingType = route.params.type.toString();
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
  if (e.target) {
    lastColor.value = color.value;
    color.value = (e.target as HTMLInputElement).value.toString();
  }
}

async function handleSubmit(this: any, t: string) {
  switch (t) {
    case "pet":
      break;
    case "item":
      break;
    default:
      console.log("Invalid route param: ", t);
      return;
  }
}

async function setCreation() {
  if (user.getUser?.ItemsRemaining! > 0) {
    canCreateItem.value = true;
  }
  if (user.getUser?.PetsRemaining! > 0) {
    canCreatePet.value = true;
  }
  loading.value = false;
}

onMounted(async () => {
  await setCreation();
});
</script>

<template>
  <v-sheet
    class="d-flex align-center justify-center flex-wrap text-center mx-auto pa-4"
    elevation="4"
    width="100%"
    rounded
  >
    <v-row>
      <v-col md="12" class="text-center">
        <h2 class="text-h4 font-weight-black ma-4">Canvas</h2>

        <v-alert v-if="loading" title="Loading..." type="info" class="ma-4"></v-alert>
        <v-alert
          v-if="(!loading && !canCreatePet) || (!loading && !canCreateItem)"
          title="You can't create anything right now!"
          type="error"
          class="ma-4"
        ></v-alert>

        <v-col
          v-if="(!loading && canCreatePet) || (!loading && canCreateItem)"
          class="mx-auto"
        >
          <!-- Confirmation Modal -->
          <v-dialog :activator="createModalRef" max-width="500">
            <CreationModal v-slot:default="{ isActive }" :thing="thingType" />
          </v-dialog>

          <!-- Buttons -->
          <v-col>
            <v-btn @click="resetCanvas" class="ma-2">Reset</v-btn>
            <v-btn
              ref="createModalRef"
              class="ma-2"
              @click="handleSubmit(route.params.type.toString())"
            >
              Finish
            </v-btn>

            <h3 class="text-h5 font-weight-black ma-4">Color Picker</h3>

            <v-row>
              <v-col>
                <v-btn
                  value="rgb(0, 0, 0)"
                  @click="handleColor($event)"
                  class="ma-2"
                  style="background-color: rgb(0, 0, 0)"
                ></v-btn>
                <h3>Black</h3>
              </v-col>

              <v-col>
                <v-btn
                  value="rgb(255, 255, 255)"
                  @click="handleColor($event)"
                  class="ma-2"
                  style="background-color: rgb(255, 255, 255)"
                ></v-btn>
                <h3>White</h3>
              </v-col>
              <v-col>
                <v-btn
                  id="lastColor"
                  :value="`${lastColor}`"
                  @click="handleColor($event)"
                  class="ma-2"
                  :style="`background-color: ${lastColor}`"
                ></v-btn>
                <h3>Last</h3>
              </v-col>
            </v-row>
          </v-col>

          <Canvas :size="24" :color="color"></Canvas>
        </v-col>
      </v-col>
    </v-row>
  </v-sheet>
</template>

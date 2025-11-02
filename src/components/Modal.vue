<script setup lang="ts">
import type { Schema } from "../../amplify/data/resource";
import { onMounted, ref } from "vue";

const props = defineProps<{
  pet: Schema["Pet"]["type"];
  items: Array<Schema["Item"]["type"]>;
}>();

const emit = defineEmits<{
  (e: "open", value: boolean): boolean;
}>();

function handleSubmit(item: any) {
  // Close the window
  emit("open", false);

  console.log(item);
}

var foodOptions = ref([]);
var playOptions = ref([]);
var selectedFoodOption = ref("");
var selectedPlayOption = ref("");

onMounted(async () => {
  const itemFilter1 = props.items;
  const itemFilter2 = props.items;
  foodOptions.value = JSON.parse(
    JSON.stringify(itemFilter1.filter((item) => item.category == "food"))
  );
  playOptions.value = JSON.parse(
    JSON.stringify(itemFilter2.filter((item) => item.category == "entertainment"))
  );
  console.log("foodOptions: ", foodOptions);
  console.log("playOptions: ", playOptions);
});
</script>
<template>
  <Teleport to="body">
    <div class="modal">
      <button class="closeButton" @click="emit('open', false)">Cancel</button>
      <div class="info">
        <h1>What would you like to do with {{ pet.name }}?</h1>
      </div>
      <div class="select-input-container">
        <h2>Feed</h2>
        <select v-model="selectedFoodOption">
          <option disabled value="">Please select one</option>
          <option v-for="item in foodOptions" :value="item">
            {{ item.name }}
          </option>
        </select>
        <button @click="handleSubmit(JSON.parse(JSON.stringify(selectedFoodOption)))">
          Do it!
        </button>
      </div>

      <div class="select-input-container">
        <h2>Play</h2>
        <select v-model="selectedPlayOption">
          <option disabled value="">Please select one</option>
          <option v-for="item in playOptions" :value="item">
            {{ item.name }}
          </option>
        </select>
        <button @click="handleSubmit(JSON.parse(JSON.stringify(selectedPlayOption)))">
          Do it!
        </button>
      </div>
    </div>
    <div id="modal-block" @scroll.prevent @touchmove.prevent @wheel.prevent>
      You can't click on anything else
    </div>
  </Teleport>
</template>

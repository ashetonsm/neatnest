<script setup lang="ts">
var name: string | null;
var speciesName: string | null;
var selectedItemType: string | null;
var itemTypes: Array<string> = ["food", "entertainment"];

const emit = defineEmits<{
  (e: "open", value: boolean): boolean;
}>();

const props = defineProps<{
  thing: string | null
}>();

async function handleSubmit() {
        console.log("Name: ", name)
        console.log("SpeciesName: ", speciesName)
        console.log("SelectedItemType: ", selectedItemType)
  // Close the window
  emit("open", false);
}
</script>
<template>
  <Teleport to="main">
  <template v-if="props.thing == 'item'">
    <div class="modal">
      <div class="info">
        <form @submit.prevent="handleSubmit()">
          <h3>Please name your {{ props.thing }}</h3>
          <input v-model="name" type="text" placeholder="Enter a name"></input>

          <h3>Is this item food or entertainment?</h3>
        <select v-model="selectedItemType">
          <option disabled value="">Please select one:</option>
          <option v-for="it in itemTypes" :value="it">
            {{ it }}
          </option>
        </select>
          <button type="submit">Create</button>
        </form>
      </div>
      <div id="modal-block" @scroll.prevent @touchmove.prevent @wheel.prevent></div>
      <button class="closeButton" @click="emit('open', false)">Cancel</button>
    </div>
  </template>
  <template v-if="props.thing == 'pet'">
    <div class="modal">
      <div class="info">
        <form @submit.prevent="handleSubmit()">
          <h3>Please name your {{ props.thing }}</h3>
          <input v-model="name" type="text" placeholder="Enter a name"></input>

          <h3>What species is your pet?</h3>
          <input v-model="speciesName" type="text" placeholder="Enter a species name"></input>

          <button type="submit">Create</button>
        </form>
      </div>
      <div id="modal-block" @scroll.prevent @touchmove.prevent @wheel.prevent></div>
      <button class="closeButton" @click="emit('open', false)">Cancel</button>
    </div>
  </template>
      <div id="modal-block" @scroll.prevent @touchmove.prevent @wheel.prevent>
      You can't click on anything else
    </div>
  </Teleport>
</template>

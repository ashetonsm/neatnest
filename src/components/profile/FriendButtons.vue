<script setup lang="ts">
import router from "@/router";
import { onMounted, ref, toRaw } from "vue";

const props = defineProps<{
  buttonValues: {
    add: boolean,
    cancel: boolean,
    remove: boolean,
    accept: boolean,
    reject: boolean,
    block: boolean,
    unblock: boolean
  };
}>();

</script>

<template>

  <v-btn v-if="props.buttonValues.add">Add</v-btn>
  <v-btn v-if="props.buttonValues.cancel">Cancel</v-btn>
  <v-btn v-if="props.buttonValues.remove">Remove</v-btn>
  <v-btn v-if="props.buttonValues.accept">Accept</v-btn>
  <v-btn v-if="props.buttonValues.reject">Reject</v-btn>
  <v-btn v-if="props.buttonValues.block">Block</v-btn>
  <v-btn v-if="props.buttonValues.unblock">Unblock</v-btn>
</template>

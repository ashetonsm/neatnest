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
  },
  updateFriend: any
}>();

</script>

<template>

  <v-btn v-if="props.buttonValues.add" @click="updateFriend('add')">Add</v-btn>
  <v-btn v-if="props.buttonValues.cancel" @click="updateFriend('remove')">Cancel</v-btn>
  <v-btn v-if="props.buttonValues.remove" @click="updateFriend('remove')">Remove</v-btn>
  <v-btn v-if="props.buttonValues.accept" @click="updateFriend('accept')">Accept</v-btn>
  <v-btn v-if="props.buttonValues.reject" @click="updateFriend('remove')">Reject</v-btn>
  <v-btn v-if="props.buttonValues.block" @click="updateFriend('block')">Block</v-btn>
  <v-btn v-if="props.buttonValues.unblock" @click="updateFriend('remove')">Unblock</v-btn>
</template>

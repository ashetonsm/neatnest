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

  <v-btn 
    v-if="props.buttonValues.add" 
    @click="updateFriend('add')"
    text="Add"
    class="mx-auto"
    variant="elevated"
    color="success"
    >Add</v-btn>
  <v-btn 
    v-if="props.buttonValues.cancel" 
    @click="updateFriend('remove')"
    text="Cancel"
    class="mx-auto"
    variant="elevated"
    color="error"
  >Cancel</v-btn>
  <v-btn 
    v-if="props.buttonValues.remove" 
    @click="updateFriend('remove')"
    text="Remove"
    class="mx-auto"
    variant="elevated"
    color="error"
  >Remove</v-btn>
  <v-btn 
    v-if="props.buttonValues.accept" 
    @click="updateFriend('accept')"
    text="Accept"
    class="mx-auto"
    variant="elevated"
    color="success"
  >Accept</v-btn>
  <v-btn 
    v-if="props.buttonValues.reject" 
    @click="updateFriend('remove')"
    text="Reject"
    class="mx-auto"
    variant="elevated"
    color="error"
  >Reject</v-btn>
  <v-btn 
    v-if="props.buttonValues.block" 
    @click="updateFriend('block')"
    text="Block"
    class="mx-auto"
    variant="elevated"
    color="error"
  >Block</v-btn>
  <v-btn 
    v-if="props.buttonValues.unblock" 
    @click="updateFriend('remove')"
    text="Unblock"
    class="mx-auto"
    variant="elevated"
    color="error"
  >Unblock</v-btn>
</template>

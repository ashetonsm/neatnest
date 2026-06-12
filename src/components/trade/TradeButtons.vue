<script setup lang="ts">
import router from "@/router";
import { onMounted, ref, toRaw } from "vue";

const props = defineProps<{
  buttonValues: {
    cancel: boolean,
    accept: boolean,
    reject: boolean
  },
  updateTrade: any
}>();

</script>

<template>
  <v-btn 
    v-if="props.buttonValues.cancel" 
    @click="updateTrade('remove')"
    text="Cancel"
    class="mx-auto"
    variant="elevated"
    color="error"
  >Cancel</v-btn>
  <v-btn 
    v-if="props.buttonValues.accept" 
    @click="updateTrade('accept')"
    text="Accept"
    class="mx-auto"
    variant="elevated"
    color="success"
  >Accept</v-btn>
  <v-btn 
    v-if="props.buttonValues.reject" 
    @click="updateTrade('reject')"
    text="Reject"
    class="mx-auto"
    variant="elevated"
    color="error"
  >Reject</v-btn>
</template>

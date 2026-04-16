<script setup lang="ts">
import { shallowRef } from "vue";
import { userStore } from "@/stores/user";

const petData = shallowRef<any>(null);
const thisFriend = shallowRef<any>(null);
const user = userStore();

const props = defineProps<{
  trade: any;
}>();

async function handleTrade(action: string) {
}

</script>

<template>
  <v-card class="mx-auto" max-width="300px">
    <v-card-title class="text-center">{{ new Date(props.trade.createdAt) }}</v-card-title>
    <v-card-subtitle>{{
      `Trade between ${
        props.trade.sender == user.getUser?.id
          ? user.getUser?.username
          : thisFriend?.username
      } and ${
        props.trade.recipient == user.getUser?.id
          ? user.getUser?.username
          : props.trade.recipient
      }`
    }}</v-card-subtitle>

    <h3>Pet Name: {{ petData?.name }}</h3>
    <h3>Trade Status: {{ props.trade.status }}</h3>
    <v-card-actions>
      <v-btn
        @click="handleTrade('accept')"
        text="Accept"
        class="mx-auto"
        variant="elevated"
        color="success"
      ></v-btn>
      <v-btn
        @click="handleTrade('reject')"
        text="Reject"
        class="mx-auto"
        variant="elevated"
        color="error"
      ></v-btn>
      <v-btn
        @click="handleTrade('cancel')"
        text="Cancel"
        class="mx-auto"
        variant="elevated"
        color="error"
      ></v-btn>
    </v-card-actions>
  </v-card>
</template>

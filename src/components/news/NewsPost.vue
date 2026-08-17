<script setup lang="ts">
import { onMounted, ref, shallowRef, toRaw } from "vue";

const props = defineProps<{
    post: any;
}>();


const reveal = ref(false)

</script>

<template>
    <v-card width="100%">
        <v-card-title class="text-center">{{new Date(props.post.date).toUTCString()}}</v-card-title>
        <v-card-text v-html="props.post.body">
        </v-card-text>
    </v-card>
</template>
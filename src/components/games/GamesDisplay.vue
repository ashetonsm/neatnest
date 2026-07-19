<script setup lang="ts">
import { ref } from 'vue';
import TicTacToe from './TicTacToe/TicTacToe.vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const game = ref(route.params.id.toString().toLowerCase())


</script>

<template>
  <template v-if="game == 'tictactoe'">
    <TicTacToe/>
  </template>
</template>

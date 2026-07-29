<script setup lang="ts">
import { ref } from 'vue';


const gamesList = ref<Array<{ title: string; to: string, link: boolean }>>([
  { title: "Tic-Tac-Toe", to: "/games/tictactoe", link: true }
]);

</script>

<template>
    <v-sheet border="md" class="pa-4 text-white mx-auto rounded" color="purple">
        <h2 class="text-h4 font-weight-black ma-4">Games:</h2>
          <v-list
            :items="gamesList"
            :item-props="true"
          ></v-list>

    </v-sheet>
</template>

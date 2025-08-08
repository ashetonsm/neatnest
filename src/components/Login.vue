<script setup lang="ts">
import { ref } from 'vue'

const username = ref('')
const password = ref('')
const checked = ref(true)
</script>

<template>
    <div class="info">
        <h1>Welcome!</h1>
        <h2>Please enter your username and password below.</h2>
        <h2>Don't have an account? Click <a href="/">here</a> to register!</h2>
    </div>
    <div class="text-input-container">
        <h2>Username:</h2>
        <input v-model="username">
    </div>
    <div class="text-input-container">
        <h2>Password:</h2>
        <input v-model="password">
    </div>


    <div>
        <h3>You entered:</h3>
        <p>{{ username }}</p>
        <p>{{ password }}</p>
    </div>

  <h2>Checkbox</h2>
  <input type="checkbox" id="checkbox" v-model="checked">
  <label for="checkbox">Checked: {{ checked }}</label>
</template>
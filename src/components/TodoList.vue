<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { Schema } from '../amplify/data/resource'
import { generateClient } from 'aws-amplify/data'

const client = generateClient<Schema>() // use this Data client for CRUDL requests

// create a reactive reference to the array of todos
const todos = ref<Array<Schema['Todo']['type']>>([]);

async function fetchTodos() {
  const { data: items, errors } = await client.models.Todo.list();
  todos.value = items; 
}

async function createTodo() {
  await client.models.Todo.create({
    content: window.prompt("Todo content?"),
    isDone: false
  })
  fetchTodos();
}

 onMounted(() => {
  fetchTodos();
});

</script>

<template>
  <div>
    <button @click="createTodo">Add new todo</button>
    <ul>
     <li 
       v-for="todo in todos" 
       :key="todo.id">
       {{ todo.content }}
     </li>
    </ul>
  </div>
</template>
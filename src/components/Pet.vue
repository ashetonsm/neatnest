<script setup lang="ts">
import Modal from './Modal.vue'
import { onMounted, ref } from 'vue'
import type { Schema } from '../../amplify/data/resource';
import { getUrl } from 'aws-amplify/storage';

const open = ref(false)
const signedSrc = ref('null')

const props = defineProps<{
  pet: Schema['Pet']['type'],
  items: Array<Schema['Item']['type']>
}>()

const toggleModal = (n:boolean) => {
  console.log('Modal toggled');
  open.value = n
  console.log("open: ", open)
  return open
};

async function getFileUrl(fileName: any) {
  try {
    const result = await getUrl({
      path: fileName, // Adjust path as needed (e.g., private/, protected/)
      options: {
        expiresIn: 3600, // URL valid for 1 hour
        validateObjectExistence: true,
      },
    });
    signedSrc.value = result.url.toString()
  } catch (error) {
    console.error('Error getting URL:', error);
    return null;
  }

  return 
}

onMounted(async () => {
  await getFileUrl(props.pet.image)
})
</script>

<template>
  <div v-if="open == true">
    <Modal :pet="pet" :items="items" @open="toggleModal(false)"/>
  </div>

  <div class="pet-container box">
    <div class="pet-image">
        <img :src="signedSrc" 
        :alt="'an image of ' + pet.name"
        @click="toggleModal(true)"/>
    </div>

    <div class="pet-info">
        <h1 class="green">{{ pet.name }}</h1>
        <h2>hunger:</h2>
        <h2 class="green">{{ pet.hunger }}</h2>
        <h2 >mood:</h2>
        <h3 class="green">{{ pet.mood }}</h3>
    </div>
  </div>
</template>

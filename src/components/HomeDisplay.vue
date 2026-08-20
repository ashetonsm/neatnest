<script setup lang="ts">
import { onMounted, ref } from 'vue';
import NewsPost from './news/NewsPost.vue';
const posts = ref()

onMounted(() => {
  getNewsPosts()
})

const headers = new Headers()

const getNewsPosts = () => {
  fetch(`https://kxyac2ee4b.execute-api.us-east-2.amazonaws.com/v1/news`, 
  {
    method: 'GET',
    headers: headers
  })
  .then(async (response) => {
    const res =  await response.json()
      .then((res) => {
        // console.log(res.response.posts)
        posts.value = res.response.posts
      })
  })
}

</script>

<template>
  <v-sheet
    class="d-flex align-center justify-center text-center mx-auto pa-8"
    elevation="4"
    width="100%"
    rounded
  >
    <v-row>
      <v-col md="12" class="text-center">
        <h2 class="text-h4 font-weight-black ma-4">News</h2>
        <hr></hr>
          <v-list v-for="post in posts" style="overflow-x: hidden;">
            <v-row>
              <NewsPost v-if="posts" :post="post"/>
            </v-row>
            <v-col md="12" class="text-center">
              <hr></hr>
            </v-col>
          </v-list>
      </v-col>
    </v-row>
  </v-sheet>
</template>

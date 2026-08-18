<script setup lang="ts">
import { onMounted, ref } from 'vue';
import NewsPost from './news/NewsPost.vue';
const posts = ref()
const blogID = "neatnest-news"

onMounted(() => {
  getNewsPosts()
})

const getNewsPosts = () => {
  fetch(`https://api.tumblr.com/v2/blog/${blogID}/posts?api_key=${import.meta.env.VITE_TUMBLR_CONSUMER_KEY}`, 
  {
    method: 'GET'
  })
  .then(async (response) => {
    const res =  await response.json()
      .then((res) => {
        console.log(res.response.posts)
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

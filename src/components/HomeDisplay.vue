<script setup lang="ts">
import { onMounted, ref, toRaw } from 'vue';
const posts = ref()
const blogID = "neatnest-news"

onMounted(() => {
  getNewsPosts()
})

const getNewsPosts = () => {
  const headers = {};

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
  .then(() => {
    // The div that the news will be displayed in
    const feed = document.getElementById("newsfeed")

    posts.value.forEach((post: { body: string; }) => {
      var newsPost = document.createElement('div');
      newsPost.innerHTML = post.body;
      feed?.appendChild(newsPost)
    });
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
        <h2 class="text-h4 font-weight-black ma-4">Home</h2>
        <div id="newsfeed">
        </div>
      </v-col>
    </v-row>
  </v-sheet>
</template>

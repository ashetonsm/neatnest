<script setup lang="ts">
import { onMounted } from 'vue';


onMounted(() => {
  getTumblrBlog()
})

const getTumblrBlog = () => {
  const script = document.createElement("script")
  script.type = "text/html"
  script.src = "https://neatnest-news.tumblr.com/js"
  // document.getElementById("newsfeed")?.appendChild(script)
  document.body.appendChild(script)
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
          This is where the latest news would be if I'd managed 
          to get that together before actually launching the site, but alas I did not...
        </div>
      </v-col>
    </v-row>
  </v-sheet>
</template>

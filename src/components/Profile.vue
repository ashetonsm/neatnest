<script setup lang="ts">
import { userStore } from "@/stores/user";
import { onMounted } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const store = userStore();
var profile = route.params.username;
var userProfileDesc = "Lorem ipsum, this is a description.";
var userPetsDisplay: any[] = [];
var userFriendsDisplay: any[] = [];

var newUsername = ""

async function changeUsername(newUN: Event) {
  console.log("Changing username to: ", newUsername)
}

async function checkUsername() {
  console.log("Checking: ", newUsername)

  /* Username rules:
  * At least 3 chars
  * Only allow [A-z][0-9]_-
  * Must be unique in the database
  * Can only change once a year
  * 
  */
}


onMounted(async () => {
  if (store.getUser.username == profile) {
    console.log("This is the logged in user's profile.")
  }
})

</script>

<template>
  <div class="page" id="profilePage">
    <div class="header">
      <h1>{{ profile }}'s Profile</h1>
      <div>
        <h3>Change your username:</h3>
        <form @submit.prevent="changeUsername($event)">
          <input v-model="newUsername" type="text" placeholder="Enter a username"></input>
          <button type="submit">Submit</button>
        </form>
      </div>
      <div class="paragraph">
        <p>
          {{ userProfileDesc }}
        </p>
      </div>
    </div>
    <div class="header">
      <h1>{{ profile }}'s Pets</h1>
      <div class="user-pet-display">
        {{ userPetsDisplay.length !== 0 ? userPetsDisplay :
          `Aww, ${profile} has no pets!` }}
      </div>
    </div>
    <div class="header">
      <div class="user-friends-display">
        <h1>{{ profile }}'s Friends</h1>
        {{ userFriendsDisplay.length !== 0 ? userFriendsDisplay :
          `Awww, ${profile} has no friends!` }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
const route = useRoute();

var profile = route.params.username;
var userProfileDesc = "Lorem ipsum, this is a description.";
var userPetsDisplay: any[] = [];
var userFriendsDisplay: any[] = [];
</script>

<template>
  <div class="page" id="profilePage">
    <div class="header">
      <h1>{{ profile }}'s Profile</h1>
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

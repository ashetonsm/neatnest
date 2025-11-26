<script setup lang="ts">
import router from "@/router";
import { userStore } from "@/stores/user";
import type { Schema } from "amplify/data/resource";
import { generateClient } from "aws-amplify/api";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import Pet from "./Pet.vue";

const client = generateClient<Schema>();
const route = useRoute();
const store = userStore();
var profile = route.params.username;
var userProfileDesc = "Lorem ipsum, this is a description.";
var userFriendsDisplay: any[] = [];
var thisUser: Schema["User"]["type"] | null = null
const thesePets = ref<Array<Schema["Pet"]["type"]>>([]);
var newUsername = ""
var newProfileDesc = ""

async function changeDescription(newDesc: Event) {
  console.log("Changing description to: ", newProfileDesc)

  var updatedUser = store.getUser
  try {
    updatedUser.description = newProfileDesc
    client.models.User.update(updatedUser)
      .then((res: any) => {
        console.log("User updated: ", res)
      })
      .then(() => {
        router.go(0)
      })
  } catch (error: any) {
    console.error(error)
  }
}

async function checkDescription() {
  console.log("Checking: ", newProfileDesc)
  /* Profile rules:
  * Nothing other than [A-z][0-9][!@#$%^&*()_+-=,.?~`]
  * Basically, no slashes or greater/less than signs.
  */


}

async function changeUsername(newUN: Event) {
  console.log("Changing username to: ", newUsername)

  var updatedUser = store.getUser
  try {
    updatedUser.username = newUsername
    client.models.User.update(updatedUser)
      .then((res: any) => {
        console.log("Username updated: ", res)
      })
      .then(() => {
        router.go(0)
      })
  } catch (error: any) {
    console.error(error)
  }
}

async function checkUsername() {
  console.log("Checking: ", newUsername)

  /* Username rules:
  * At least 3 chars
  * Only allow [A-z][0-9][_-]
  * Must be unique in the database
  * Can only change once a year
  * Can't change to same thing
  */
}


onMounted(async () => {
  if (store.getUser.username !== profile) {
    // get the user id via username
    try {
      client.models.User.userByUsername({
        username: profile.toString()
      }).then((res) => {
        thisUser = res.data[0]
        console.log(thisUser)
      })
      .then(() => {
        // get the pets via id
        if (thisUser) {
          console.log("There is a user")
          client.models.Pet.listPetsByOwnerAndName({
            owner: thisUser.id
          }).then((res) => {
            console.log("Pet res: ", res.data)
            thesePets.value = res.data
            console.log(thesePets)
          })
        }
      })

    } catch (error: any) {
      console.error(error)  // The user probably doesn't exist in the db.
    }
  }
})

</script>

<template>
  <div class="page" id="profilePage">
    <div class="header">
      <h1>{{ profile }}'s Profile</h1>
      <div v-if="store.getUser.username == profile">
        <h3>Change your username:</h3>
        <form @submit.prevent="changeUsername($event)">
          <input v-model="newUsername" type="text" placeholder="Enter a username"></input>
          <button type="submit">Submit</button>
        </form>
      </div>
      <div class="paragraph">
        <div v-if="store.getUser.username == profile">
          <p>
            {{ store.getUser.description }}
          </p>
          <h3>Edit:</h3>
          <form @submit.prevent="changeDescription($event)">
            <input v-model="newProfileDesc" type="text"></input>
            <button type="submit">Submit</button>
          </form>
        </div>
        <div v-else>
          <p>
            {{ userProfileDesc }}
          </p>
        </div>
      </div>
    </div>
    <div class="header">
      <h1>{{ profile }}'s Pets</h1>
      <div class="user-pet-display">
      <div v-if="thesePets.length !== 0">
        <Pet
          v-for="(pet, i) in thesePets"
          :key="pet.name ?? i"
          :pet="pet"
          :items="[]"
        />
      </div>
      <div v-else>
          Aww, {{profile}} has no pets!
      </div>
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

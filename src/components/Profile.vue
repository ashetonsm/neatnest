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
const thisProfileDesc = ref<String>("Lorum ipsum this is a description");
const thisFriend = ref<{ username: string; status: string; id: string }>();
const theseFriends = ref<Array<{ username: string; status: string; id: string }>>([]);
var thisUser: Schema["User"]["type"] | null = null;
const thesePets = ref<Array<Schema["Pet"]["type"]>>([]);
const cannotFriend = ref(true);
const cannotBlock = ref(true);
const canUnblock = ref(false);
var newUsername = "";
var newProfileDesc = "";

async function changeDescription(newDesc: Event) {
  console.log("Changing description to: ", newProfileDesc);

  var updatedUser = store.getUser;
  try {
    updatedUser.description = newProfileDesc;
    client.models.User.update(updatedUser)
      .then((res: any) => {
        console.log("User updated: ", res);
      })
      .then(() => {
        router.go(0);
      });
  } catch (error: any) {
    console.error(error);
  }
}

async function checkDescription() {
  console.log("Checking: ", newProfileDesc);
  /* Profile rules:
   * Nothing other than [A-z][0-9][!@#$%^&*()_+-=,.?~`]
   * Basically, no slashes or greater/less than signs.
   */
}

async function changeUsername(newUN: Event) {
  console.log("Changing username to: ", newUsername);

  var updatedUser = store.getUser;
  try {
    updatedUser.username = newUsername;
    client.models.User.update(updatedUser)
      .then((res: any) => {
        console.log("Username updated: ", res);
      })
      .then(() => {
        router.go(0);
      });
  } catch (error: any) {
    console.error(error);
  }
}

async function checkUsername() {
  console.log("Checking: ", newUsername);

  /* Username rules:
   * At least 3 chars
   * Only allow [A-z][0-9][_-]
   * Must be unique in the database
   * Can only change once a year
   * Can't change to same thing
   */
}

async function fetchUser() {
  try {
    await client.models.User.userByUsername({
      username: profile.toString(),
    })
      .then((res) => {
        thisUser = res.data[0];
        thisProfileDesc.value = thisUser?.description as string;
      })
      .then(() => {
        // get the pets via id
        if (thisUser) {
          console.log("There is a user");
          fetchPets();
        }
      });
  } catch (error: any) {
    console.error(error); // The user probably doesn't exist in the db.
  }
}

async function fetchPets() {
  await client.models.Pet.listPetsByOwnerAndName({
    owner: thisUser?.id as string,
  }).then((res) => {
    thesePets.value = res.data;
  });
}

async function addFriend() {
  if ((thisUser?.id as string) !== store.getUser.id) {
    await client.models.Friend.create({
      friendA: thisUser?.id as string,
      friendB: store.getUser.id,
      status: "pending",
    }).then((res) => {
      cannotFriend.value = true;
      console.log("Friend res: ", res.data);
      router.go(0);
    });
  } else {
    alert("You can't add yourself as a friend!");
  }
}
async function blockFriend() {
  if ((thisUser?.id as string) !== store.getUser.id) {
    await client.models.Friend.create({
      friendA: thisUser?.id as string,
      friendB: store.getUser.id,
      status: "blocked",
    }).then((res) => {
      cannotBlock.value = true;
      console.log("Friend res: ", res.data);
      router.go(0);
    });
  } else {
    alert("You can't block yourself!");
  }
}

async function unBlockFriend(blockedFriend: any) {
  if ((thisUser?.id as string) !== store.getUser.id) {
    var updatedFriend = thisFriend.value;
    updatedFriend!.status = "accepted";

    await client.models.Friend.update(updatedFriend!).then((res) => {
      cannotBlock.value = false;
      canUnblock.value = false;
      console.log("Friend res: ", res.data);
      router.go(0);
    });
  } else {
    alert("You can't unblock yourself!");
  }
}

onMounted(async () => {
  // Not viewing logged in user's profile
  if (store.getUser.username !== profile) {
    await fetchUser();
  } else {
    // Viewing logged in user's profile
    thisUser = store.getUser;
    thisProfileDesc.value = thisUser?.description as string;
    thesePets.value = store.getPets;
  }
  // Either way, the friends are determined in the store.
  theseFriends.value = await store.fetchFriends(thisUser!.id);
});
</script>

<template>
  <v-sheet
    class="d-flex align-center justify-center flex-wrap text-center mx-auto pa-4"
    elevation="4"
    width="100%"
    rounded
  >
    <v-row>
      <v-col md="12" class="text-center">
        <h2 class="text-h4 font-weight-black ma-4">{{ profile }}'s Profile</h2>
        <v-alert
          v-if="profile == 'null'"
          title="Profile not found!"
          type="error"
          class="ma-4"
        ></v-alert>

        <v-btn
          :disabled="cannotFriend"
          class="mt-2"
          color="primary"
          text="Add Friend"
          @click="addFriend"
        ></v-btn>
        <v-btn
          :disabled="cannotBlock"
          class="mt-2"
          color="error"
          text="Block"
          @click="blockFriend"
        ></v-btn>
        <v-btn
          v-if="canUnblock"
          class="mt-2"
          color="error"
          text="Block"
          @click="unBlockFriend"
        ></v-btn>
      </v-col>

      <v-col class="mx-auto" v-if="store.getUser.username == profile">
        <!-- Change your username -->
        <v-expansion-panels>
          <v-expansion-panel>
            <v-expansion-panel-title
              ><span>Change username</span></v-expansion-panel-title
            >
            <v-expansion-panel-text>
              <v-form @submit.prevent="changeUsername($event)">
                <v-text-field
                  v-model="newUsername"
                  label="Username"
                  :placeholder="store.getUser.username"
                ></v-text-field>
                <v-btn class="mt-2" text="Submit" type="submit"></v-btn>
              </v-form>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>

        <!-- Change your description -->
        <v-expansion-panels>
          <v-expansion-panel>
            <v-expansion-panel-title
              ><span>Change description</span></v-expansion-panel-title
            >
            <v-expansion-panel-text>
              <v-form @submit.prevent="changeDescription($event)">
                <v-text-field
                  v-model="newProfileDesc"
                  label="Description"
                  :placeholder="store.getUser.description"
                ></v-text-field>
                <v-btn class="mt-2" text="Submit" type="submit"></v-btn>
              </v-form>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>

      <v-col cols="12" class="mx-auto">
        <!-- Description -->
        <v-sheet border="md" class="pa-4 text-white mx-auto rounded" color="primary">
          <h4 class="text-h5 font-weight-bold mb-4">Description:</h4>
          <p>
            {{ thisProfileDesc }}
          </p>
        </v-sheet>

        <!-- Pets -->
        <v-sheet border="md" class="pa-4 text-white mx-auto rounded" color="secondary">
          <v-row>
            <v-col md="12" class="text-center">
              <h2 class="text-h4 font-weight-black ma-4">{{ profile }}'s Pets:</h2>
              <v-row class="ga-4" v-if="thesePets.length !== 0">
                <Pet
                  v-for="(pet, i) in thesePets"
                  :key="pet.name ?? i"
                  :pet="pet"
                  :items="[]"
                />
              </v-row>
              <div v-else>Aww, {{ profile }} has no pets!</div>
            </v-col>
          </v-row>
        </v-sheet>

        <!-- Friends -->
        <v-sheet border="md" class="pa-4 text-white mx-auto rounded" color="purple">
          <h2 class="text-h4 font-weight-black ma-4">{{ profile }}'s Friends:</h2>
          <v-list v-if="theseFriends.length">
            <v-list-item
              v-for="n in theseFriends"
              :key="'Friend: ' + n.username"
              :title="n.username.toString()"
              :to="'/profile/' + n.username"
            ></v-list-item>
          </v-list>
          <div v-else>Aww, {{ profile }} has no friends!</div>
        </v-sheet>
      </v-col>
    </v-row>
  </v-sheet>
</template>

<script setup lang="ts">
import router from "@/router";
import { userStore } from "@/stores/user";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import Pet from "./Pet.vue";
import { GET_BY_PK_SK, GET_BY_USERNAME, LIST_BY_PK_SK, PUT_DATA, UPDATE_FRIEND } from "./tools/ddbActions";

const route = useRoute();
const user = userStore();
var profile = route.params.username;
const thisProfileDesc = ref<String>("Lorum ipsum this is a description");
const thisFriend = ref<any | any>(null);
const theseFriends = ref<any>([]);
const thisUser = ref<any>();
const thesePets = ref<Array<any>>([]);
var newUsername = "";
var newProfileDesc = "";

async function changeBio(newDesc: Event) {
  console.log("Changing description to: ", newProfileDesc);

  var updatedUser = user.getUser!;
  try {
    updatedUser.bio = newProfileDesc;
    await PUT_DATA(updatedUser).then(async () => {
      router.push(`/profile/${updatedUser.username}`);
      // router.go(0)
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

  var updatedUser = user.getUser!;
  try {
    updatedUser.username = newUsername;
    updatedUser.bio = newProfileDesc;
    await PUT_DATA(updatedUser).then(async () => {
      router.push(`/profile/${updatedUser.username}`);
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
    await GET_BY_USERNAME(profile.toString(), "#METADATA")
      .then((res) => {
        console.log(res)
        thisUser.value = res
        thisProfileDesc.value = thisUser.value.bio as string;
      })
      .then(async () => {
        await LIST_BY_PK_SK(thisUser.value.PK, "RELATIONSHIP#")
          .then((res) => {
            console.log(res)
            theseFriends.value = res
          })
        await GET_BY_PK_SK(thisUser.value.PK, `RELATIONSHIP#${user.getUser.PK}`)
          .then((res) => {
            if (res !== null) {
              console.log(true, res)
              thisFriend.value = res
            } else {
              console.log(false, res)
              thisFriend.value = null
            }
            console.log("user.getUser.username", user.getUser.username)
            console.log("thisFriend.username", thisFriend.value?.username)
          })
      })
  } catch (error: any) {
    console.error(error); // The user probably doesn't exist in the db.
  }
}

/** Used to block and accept friends */
async function updateFriend(action: string) {
  await UPDATE_FRIEND(thisUser.value, user.getUser, action)
    .then(() => {
      router.push(`/profile/${profile}`);
      router.go(0);
    })
}

onMounted(async () => {
  // Not viewing logged in user's profile
  if (user.getUser!.username !== profile) {
    await fetchUser();
  } else {
    // Viewing logged in user's profile
    thisUser.value = user.getUser!;
    thisProfileDesc.value = thisUser.value.bio as string;
    thesePets.value = user.getPets;
  }
});
</script>

<template>
  <v-sheet class="d-flex align-center justify-center flex-wrap text-center mx-auto pa-4" elevation="4" width="100%"
    rounded>
    <v-row>
      <v-col md="12" class="text-center">
        <h2 class="text-h4 font-weight-black ma-4">{{ profile }}'s Profile</h2>
        <v-alert v-if="profile == 'null'" title="Profile not found!" type="error" class="ma-4"></v-alert>

        <v-btn color="secondary" :to="'/shop/' + profile" class="mb-4">
          {{ profile == user.getUser?.username ? "Your Shop" : profile + "'s Shop" }}
        </v-btn>

        <!-- Stuff to display for the logged in user -->
        <template v-if="profile == user.getUser?.username">
          <v-btn text="Trade Requests" to="/trades"></v-btn>
          <h2 class="text-h4 font-weight-black ma-4">
            Credits: {{ user.getCredits > 0 ? user.getCredits : 0 }}
          </h2>
        </template>

        <v-btn :disabled="profile == user.getUser?.username ||
          [0, 1, 2].includes(thisFriend?.status!)
          ? true
          : false
          " class="mt-2" color="primary" text="Add Friend" @click="updateFriend('add')"></v-btn>

        <!-- Accept Request is available if Friend status is pending and 
        you are NOT the owner of the Friend record 
        Otherwise, display "Pending" and disable the button.
        -->
        <v-btn v-if="thisFriend !== null && thisFriend.status !== 2"
          :disabled="profile == user.getUser?.username ? true : false" class="mt-2" color="primary" :text="thisFriend.status == 0 && thisFriend.value?.username == user.getUser?.username
            ? 'Accept Request'
            : thisFriend?.status == 0
              ? 'Cancel Request'
              : 'Remove Friend'
            " @click="
              thisFriend?.status == 0 && thisFriend.value?.username !== user.getUser?.username
                ? updateFriend('accept')
                : updateFriend('remove')
              "></v-btn>
        <!-- Always display -->
        <v-btn :disabled="profile == user.getUser?.username
          ? true
          : thisFriend?.status == 2 && thisFriend.value?.username == user.getUser?.username
            ? true
            : false
          " class="mt-2" color="error" :text="[1, 0, undefined].includes(thisFriend?.status!) ?
            'Block' : thisFriend?.status == 2 && thisFriend.value?.username == user.getUser?.username ?
              'Block' :
              'Unblock'
            "
          @click="(!thisFriend || [1, 0].includes(thisFriend?.status!)) ? updateFriend('block') : updateFriend('remove')"></v-btn>
      </v-col>

      <v-col class="mx-auto" v-if="user.getUser!.username == profile">
        <!-- Change your username -->
        <v-expansion-panels>
          <v-expansion-panel>
            <v-expansion-panel-title><span>Change username</span></v-expansion-panel-title>
            <v-expansion-panel-text>
              <v-form @submit.prevent="changeUsername($event)">
                <v-text-field v-model="newUsername" label="Username"
                  :placeholder="user.getUser!.username"></v-text-field>
                <v-btn class="mt-2" text="Submit" type="submit"></v-btn>
              </v-form>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>

        <!-- Change your description -->
        <v-expansion-panels>
          <v-expansion-panel>
            <v-expansion-panel-title><span>Change description</span></v-expansion-panel-title>
            <v-expansion-panel-text>
              <v-form @submit.prevent="changeBio($event)">
                <v-text-field v-model="newProfileDesc" label="Description"
                  :placeholder="user.getUser!.bio!"></v-text-field>
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
                <Pet v-for="(pet, i) in thesePets" :key="pet.name ?? i" :pet="pet" :items="[]" />
              </v-row>
              <div v-else>Aww, {{ profile }} has no pets!</div>
            </v-col>
          </v-row>
        </v-sheet>

        <!-- Friends -->
        <v-sheet border="md" class="pa-4 text-white mx-auto rounded" color="purple">
          <h2 class="text-h4 font-weight-black ma-4">{{ profile }}'s Friends:</h2>
          <v-list v-if="
            theseFriends &&
            theseFriends.filter((f: { status: number; }) => f.status == 1).length !== 0
          ">
            <template v-for="n in theseFriends.filter((f: { status: number; }) => f.status == 1)">
              <v-list-item v-if="n" :key="'Friend: ' + n.username" :title="n.username.toString()"
                :to="'/profile/' + n.username"></v-list-item>
            </template>
          </v-list>
          <div v-else>Aww, {{ profile }} has no friends!</div>
        </v-sheet>
      </v-col>
    </v-row>
  </v-sheet>
</template>

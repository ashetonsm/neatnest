<script setup lang="ts">
import router from "@/router";
import { userStore } from "@/stores/user";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import Pet from "@/components/Pet.vue"
import {
  GET_BY_USERNAME,
  LIST_BY_PK_SK,
  PUT_DATA,
  UPDATE_FRIEND
} from "@/components/tools/ddbActions";
import FriendsList from "./FriendsList.vue";
import ChangeProfile from "./ChangeProfile.vue";
import type { SubmitEventPromise } from "vuetify";

const route = useRoute();
const user = userStore();
var profile = route.params.username;
const thisProfileDesc = ref<String>("Lorum ipsum this is a description");
const friends = ref<any>([]);
const thisUser = ref<any>();
const thesePets = ref<Array<any>>([]);

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
            friends.value = res
          })
        console.log("user.getUser.username", user.getUser.username)
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
      </v-col>

      <v-col class="mx-auto" v-if="user.getUser!.username == profile">
        <ChangeProfile/>
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

        <FriendsList :friends="friends" username="profile" />
      </v-col>
    </v-row>
  </v-sheet>
</template>
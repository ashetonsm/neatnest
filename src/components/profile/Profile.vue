<script setup lang="ts">
import { userStore } from "@/stores/user";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import Pet from "@/components/Pet.vue"
import {
  GET_BY_USERNAME} from "@/components/tools/ddbActions";
import ChangeProfile from "./ChangeProfile.vue";

const route = useRoute();
const user = userStore();
var profile = route.params.username;
const profileUserBio = ref<String>("Lorum ipsum this is a description");
// const buttonValues = ref<{
//   add: boolean,
//   cancel: boolean,
//   remove: boolean,
//   accept: boolean,
//   reject: boolean,
//   block: boolean,
//   unblock: boolean
// }>({
//   add: false,
//   cancel: false,
//   remove: false,
//   accept: false,
//   reject: false,
//   block: false,
//   unblock: false
// })
const profileUser = ref<any>()
const profilePets = ref<Array<any>>([])

async function fetchUser() {
  try {
    await GET_BY_USERNAME(profile.toString(), "%23METADATA")
      .then(async (res) => {
        profileUser.value = res
        profileUserBio.value = profileUser.value.bio as string;
      })
  } catch (error: any) {
    console.error(error); // The user probably doesn't exist in the db.
  }
}

// async function setFriends() {
//   // Set the target friend.
//   try {
//     var filteredFriend = [structuredClone(toRaw(friends.value))]
//     filteredFriend.filter((f: any) => {
//       if (f.relationshipUsername == user.getUser.username) {
//         console.log("f", f)
//         targetFriend.value = f
//       }
//     })
//     if (targetFriend.value) {
//       // console.log("Friend status:", targetFriend.value.status)

//       /*
//       * 0 = Your incoming friend request is pending.
//       * 1 = accepted
//       * 2 = blocked for the target
//       * 8 = blocked for the initiator
//       * 9 = Your outgoing friend request is pending.
//       */
//       switch (targetFriend.value.status) {
//         case 0:
//           // console.log("You are waiting for a response from this user.")
//           buttonValues.value.cancel = true
//           buttonValues.value.block = true
//           return
//         case 1:
//           buttonValues.value.remove = true
//           buttonValues.value.block = true
//           return
//         case 2:
//           // console.log("You are blocked (don't tell them this, obviously.)")
//           return
//         case 8:
//           // console.log("You blocked this user.")
//           buttonValues.value.unblock = true
//           return
//         case 9:
//           // console.log("This user is waiting for a response from you.")
//           buttonValues.value.accept = true
//           buttonValues.value.reject = true
//           buttonValues.value.block = true
//           return
//         default:
//           // console.log("No friend status found.")
//           buttonValues.value.add = true
//           buttonValues.value.block = true
//       }
//     } else {
//       buttonValues.value.add = true
//       buttonValues.value.block = true
//     }
//   } catch (error: any) {
//     console.error("Something went wrong setting the targetFriend value.", error)
//   }
// }

/** Used to block and accept friends */
// async function updateFriend(action: string) {
//   var relationshipObj = { PK: '', relationshipUsername: '' }
//   relationshipObj.PK = profileUser.value.PK
//   relationshipObj.relationshipUsername = profileUser.value.username
//   await UPDATE_RELATIONSHIP(relationshipObj, user.getUser, action)
//     .then(async () => {
//       if (action == "add") {
//         await createNotification(user.getUser, profileUser.value, "friendNew")
//       }
//       if (action == "accept") {
//         await createNotification(user.getUser, profileUser.value, "friendAccept")
//       }
//     })
//     .then(() => {
//       router.push(`/profile/${profile}`);
//       router.go(0);
//     })
// }

async function getPets(PK: string) {
  const data = await user.fetchPets(PK)
  if (data.length) {
    return data
  } else {
    return [data]
  }
}

// async function getFriends(PK: string) {
//   const data = await user.fetchRelationships(PK)
//   console.log(data)
//   if (data) {
//     return data
//   } else {
//     return []
//   }
// }

onMounted(async () => {
  // Not viewing logged in user's profile
  if (user.getUser.username !== profile) {
    await fetchUser();
    // friends.value = await getFriends(profileUser.value.PK)
    // await setFriends()
    profilePets.value = await getPets(profileUser.value.PK)
  } else {
    // Viewing logged in user's profile
    profileUser.value = user.getUser;
    profileUserBio.value = user.getUser.bio as string;
    profilePets.value = await getPets(user.getUser.PK)
    // friends.value = await getFriends(user.getUser.PK)

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

        <!-- <FriendButtons :buttonValues="buttonValues" :updateFriend="updateFriend" /> -->


        <!-- Stuff to display for the logged in user -->
        <template v-if="profile == user.getUser?.username">
          <v-btn text="Trade Requests" to="/trades"></v-btn>
          <h2 class="text-h4 font-weight-black ma-4">
            Credits: {{ user.getCredits > 0 ? user.getCredits : 0 }}
          </h2>
        </template>
      </v-col>

      <v-col class="mx-auto" v-if="user.getUser!.username == profile">
        <ChangeProfile />
      </v-col>

      <v-col cols="12" class="mx-auto">
        <!-- Description -->
        <v-sheet border="md" class="pa-4 text-white mx-auto rounded" color="primary">
          <h4 class="text-h5 font-weight-bold mb-4">Description:</h4>
          <p>
            {{ profileUserBio }}
          </p>
        </v-sheet>

        <!-- Pets -->
        <v-sheet border="md" class="pa-4 text-white mx-auto rounded" color="secondary">
          <v-row>
            <v-col md="12" class="text-center">
              <h2 class="text-h4 font-weight-black ma-4">{{ profile }}'s Pets:</h2>
              <v-row class="ga-4" v-if="profilePets.length !== 0">
                <Pet v-for="(pet, i) in profilePets" :key="pet.name ?? i" :pet="pet" :items="[]" />
              </v-row>
              <div v-else>Aww, {{ profile }} has no pets!</div>
            </v-col>
          </v-row>
        </v-sheet>

        <!-- <FriendsList :friends="friends" :username="profile as string" /> -->
      </v-col>
    </v-row>
  </v-sheet>
</template>
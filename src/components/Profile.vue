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
const user = userStore();
var profile = route.params.username;
const thisProfileDesc = ref<String>("Lorum ipsum this is a description");
const thisFriend = ref<Schema["Friend"]["type"] | any>(null);
const theseFriends = ref<
  Array<{ username: string; friendObject: Schema["Friend"]["type"] }>
>([]);
const thisUser = ref<Schema["User"]["type"]>();
const thesePets = ref<Array<Schema["Pet"]["type"]>>([]);
var newUsername = "";
var newProfileDesc = "";

async function changeDescription(newDesc: Event) {
  console.log("Changing description to: ", newProfileDesc);

  var updatedUser = user.getUser!;
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

  var updatedUser = user.getUser!;
  try {
    updatedUser.username = newUsername;
    await client.models.User.update(updatedUser)
      .then((res: any) => {
        console.log("Username updated: ", res);
      })
      .then(async () => {
        var updatedShop = user.getShop!;
        updatedShop.name = newUsername
        console.log("user.getShop", user.getShop!)
        console.log("updatedShop", updatedShop)
        await client.models.Shop.update(updatedShop)
        .then((res: any) => {
          console.log("Shop name updated: ", res)
        })
      })
      .then(async () => {
        await router.push(`/profile/${newUsername}`);
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
        thisUser.value = res.data[0];
        thisProfileDesc.value = thisUser.value.description as string;
      })
      .then(() => {
        // get the pets via id
        if (thisUser.value) {
          fetchPets();
        }
      });
  } catch (error: any) {
    console.error(error); // The user probably doesn't exist in the db.
  }
}

async function fetchPets() {
  await client.models.Pet.listPetsByOwnerAndName({
    ownerId: thisUser.value?.id as string,
  }).then((res) => {
    thesePets.value = res.data;
  });
}

async function addFriend() {
  if ((thisUser.value?.id as string) !== user.getUser!.id) {
    await client.models.Friend.create({
      friendA: thisUser.value?.id as string,
      friendB: user.getUser!.id,
      status: "pending",
    }).then((res) => {
      console.log("Updated friend res: ", res.data);
      router.go(0);
    });
  } else {
    alert("You can't add yourself as a friend!");
  }
}

/** Used for both delete friend and unblock */
async function deleteFriend() {
  await client.models.Friend.delete({ id: thisFriend.value?.id }).then((res) => {
    console.log("Deleted friend res: ", res.data);
    router.go(0);
  });
}

/** Used to block and accept friends */
async function updateFriend(action: string) {
  var updatedFriend: any = {};
  updatedFriend!.id = thisFriend.value?.id;

  switch (action) {
    case "block":
      updatedFriend!.status = "blocked";
      break;
    case "accept":
      updatedFriend!.status = "accepted";
      break;
    default:
      console.log("Invalid friend action");
      break;
  }
  await client.models.Friend.update(updatedFriend).then(async (res) => {
    if (res.data == null) {
      console.log("No friend found. Creating new friend to block.");
      await client.models.Friend.create({
        friendA: thisUser.value?.id as string,
        friendB: user.getUser!.id,
        status: "blocked",
      }).then((res) => {
        console.log("Blocked with new friend created: ", res.data);
      });
    } else {
      console.log("Updated existing friend: ", res.data);
    }
    router.go(0);
  });
}

onMounted(async () => {
  // Not viewing logged in user's profile
  if (user.getUser!.username !== profile) {
    await fetchUser();
  } else {
    // Viewing logged in user's profile
    thisUser.value = user.getUser!;
    thisProfileDesc.value = thisUser.value?.description as string;
    thesePets.value = user.getPets;
  }
  // Either way, the friends are determined in the user.
  theseFriends.value = await user.fetchFriends(thisUser.value!.id);
  if (theseFriends.value) {
    theseFriends.value.filter((friend) => {
      // Logged in user has a friend entry with the current profile
      if (friend.username === user.getUser!.username) {
        thisFriend.value = JSON.parse(JSON.stringify(friend.friendObject));
      }
      console.log("thisFriend: ", thisFriend.value);
    });
  }
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
        color="secondary" 
        :to="'/shop/' + profile" 
        class="mb-4">
        {{profile == user.getUser?.username ? 'Your Shop' : profile + "'s Shop"}}
        </v-btn>
        
        <!-- Stuff to display for the logged in user -->
        <template v-if="profile == user.getUser?.username"> 
        <v-btn text="Trade Requests" to="/trades"></v-btn>
        <h2 class="text-h4 font-weight-black ma-4">
        Credits: {{ user.getCredits > 0 ? user.getCredits : 0 }}</h2>
        </template>



        <v-btn
          :disabled="
            profile == user.getUser?.username ||
            ['accepted', 'pending', 'blocked'].includes(thisFriend?.status!)
              ? true
              : false
          "
          class="mt-2"
          color="primary"
          text="Add Friend"
          @click="addFriend()"
        ></v-btn>

        <!-- Accept Request is available if Friend status is pending and 
        you are NOT the owner of the Friend record 
        Otherwise, display "Pending" and disable the button.
        -->
        <v-btn
          v-if="thisFriend !== null && thisFriend.status !== 'blocked'"
          :disabled="profile == user.getUser?.username ? true : false"
          class="mt-2"
          color="primary"
          :text="
            thisFriend?.status == 'pending' && thisFriend?.owner !== user.getUser?.id
              ? 'Accept Request'
              : thisFriend?.status == 'pending'
              ? 'Cancel Request'
              : 'Remove Friend'
          "
          @click="
            thisFriend?.status == 'pending' && thisFriend?.owner !== user.getUser?.id
              ? updateFriend('accept')
              : deleteFriend()
          "
        ></v-btn>
        <!-- Always display -->
        <v-btn
          :disabled="
            profile == user.getUser?.username
              ? true
              : thisFriend?.status == 'blocked' && thisFriend?.owner !== user.getUser?.id
              ? true
              : false
          "
          class="mt-2"
          color="error"
          :text="['accepted', 'pending', undefined].includes(thisFriend?.status!) ? 
          'Block' : thisFriend?.status == 'blocked' && thisFriend?.owner !== user.getUser?.id ?
          'Block' :
          'Unblock'
          "
          @click="(!thisFriend || ['accepted', 'pending'].includes(thisFriend?.status!)) ? updateFriend('block') : deleteFriend()"
        ></v-btn>
      </v-col>

      <v-col class="mx-auto" v-if="user.getUser!.username == profile">
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
                  :placeholder="user.getUser!.username"
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
                  :placeholder="user.getUser!.description!"
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
          <v-list
            v-if="
              theseFriends &&
              theseFriends.filter((f) => f.friendObject.status == 'accepted').length !== 0
            "
          >
            <template
              v-for="n in theseFriends.filter((f) => f.friendObject.status == 'accepted')"
            >
              <v-list-item
                v-if="n"
                :key="'Friend: ' + n.username"
                :title="n.username.toString()"
                :to="'/profile/' + n.username"
              ></v-list-item>
            </template>
          </v-list>
          <div v-else>Aww, {{ profile }} has no friends!</div>
        </v-sheet>
      </v-col>
    </v-row>
  </v-sheet>
</template>

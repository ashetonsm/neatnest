<script setup lang="ts">
import Pet from "./Pet.vue";
import { onMounted, ref } from "vue";
import { userStore } from "@/stores/user";
import { useAuth0 } from "@auth0/auth0-vue";
import { useRouter } from "vue-router";
const store = userStore();
const router = useRouter()
const fetchedPets = ref<Array<any>>([]);
const fetchedItems = ref<Array<any>>([]);
var canCreate = false;
const {user} = useAuth0()

async function setCreation() {
  if (store.getUser?.petsRemaining! > 0) {
    canCreate = true;
  }
}

async function getInventory() {
  const data = await store.fetchInventory(store.getUser.PK)
  console.log("data", data)
  if (data.length) {
    return data
  } else {
    return [data]
  }
}
async function getPets() {
  const data = await store.fetchPets(store.getUser.PK)
  console.log("data", data)
  if (data.length) {
    return data
  } else {
    return [data]
  }
}

onMounted(async () => {
  try {
    console.log("user.value?.sub", user.value?.sub)
    if (user.value?.sub) {
      store.setUserPK(user.value?.sub)
    } else {
      router.push({name: 'home'})
    }
    await setCreation();
    fetchedItems.value = await getInventory()
    fetchedPets.value = await getPets()
  } catch (error: any) {
    console.error(error)
  }

});
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
        <h2 class="text-h4 font-weight-black ma-4">Your Pets</h2>

        <v-alert
          v-if="!fetchedPets"
          title="Loading..."
          type="info"
          class="ma-4"
        ></v-alert>
        <v-alert
          v-else-if="!fetchedPets.length"
          title="Aw... you have no pets!"
          type="info"
          class="ma-4"
        ></v-alert>

        <v-btn
          v-if="canCreate"
          color="primary"
          to="/canvas/pet"
          class="mb-4"
          >Launch Canvas
        </v-btn>

        <v-btn color="secondary" to="/trades" class="mb-4">Your Trades </v-btn>

        <v-row class="ga-4">
          <Pet
            v-for="(pet, i) in fetchedPets"
            :key="pet.name ?? i"
            :pet="pet"
            :items="fetchedItems"
          />
        </v-row>
      </v-col>
    </v-row>
  </v-sheet>
</template>

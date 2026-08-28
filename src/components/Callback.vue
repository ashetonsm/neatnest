<script setup lang="ts">
import { userStore } from "../stores/user";
import { useAuth0 } from "@auth0/auth0-vue";
import { PUT_DATA } from "./tools/ddbActions";
import { createNotification } from "./notifications/createNotification";
import { onMounted, toRaw } from "vue";
import { useRouter } from "vue-router";

const router = useRouter()
const uStore = userStore();
const { user } = useAuth0();
const auth0 = useAuth0();

console.log("User is authenticated: ", auth0.isAuthenticated.value)
if (user.value !== undefined) {
  console.log("Starting user store actions")
  await uStore.fetchUser(user.value.sub as string, "#METADATA", toRaw(user.value))
    .then(async () => {
      const updatedCreationData = await setCreationCredits(new Date().getTime(), uStore.getUser.updatedAt)
      await PUT_DATA(updatedCreationData)
        .then(() => {
          router.push({ name: 'home' })
        })
    })
}

async function setCreationCredits(currentDate: number, lastCreditRefresh: number) {
  // 1 day is 86400000 ms
  const msDifference = currentDate - lastCreditRefresh
  const dayDifference = msDifference / (1000 * 3600 * 24);
  const updatedUser = uStore.getUser
  if (dayDifference >= 15) {
    var update = false

    if (updatedUser.itemsRemaining + 1 <= 3) {
      updatedUser.itemsRemaining++
      await createNotification(uStore.getUser, null, "addedItemCredit")
      update = true
    }
    if (updatedUser.petsRemaining + 1 <= 3) {
      updatedUser.petsRemaining++
      await createNotification(uStore.getUser, null, "addedPetCredit")
      update = true
    }
    if (update == true) {
      // NOW update the last credit refresh date
      updatedUser.updatedAt = new Date().getTime()
    }
  }
  // Regardless, update the lastLogin time
  updatedUser.lastLogin = new Date().getTime()
  return updatedUser
}
</script>

<template>
  <h1>Logging in...</h1>
</template>

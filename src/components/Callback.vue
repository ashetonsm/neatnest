<script setup lang="ts">
import router from "@/router";
import { userStore } from "../stores/user";
import { useAuth0 } from "@auth0/auth0-vue";
import { PUT_DATA } from "./tools/ddbActions";
import { createNotification } from "./notifications/createNotification";

const uStore = userStore();
const { user } = useAuth0();

if (!uStore.getUser || uStore.getUser.username == undefined) {
  await uStore.fetchUser(user.value?.sub as string, "#METADATA", user)
    .then(async () => {
    setCookie(uStore.getUser.PK, 1)
    const newUserData = await setCreationCredits(new Date().getTime(), uStore.getUser.updatedAt)
    await PUT_DATA(newUserData)
    router.push({name: 'home'})
  })
}

function setCookie(cvalue: string, exdays: number) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  let expires = "expires=" + d.toUTCString();
  document.cookie = "currentUser=" + cvalue + ";" + expires + ";path=/";
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

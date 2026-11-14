<script setup lang="ts">
import { userStore } from '@/stores/user';
import FriendsList from './profile/FriendsList.vue';
import { onMounted, ref } from 'vue';

const store = userStore()
const friends = ref()

async function getFriends() {
    const data = await store.fetchRelationships(store.getUser.username, "", "")
    // Do not return the data inside of an array, it's unnecessary.
    if (data) {
        return data
    } else {
        return []
    }
}

onMounted(async () => {
    friends.value = await getFriends()
})
</script>


<template>
    <FriendsList :friends="friends || []" :username="store.getUser.username" />
</template>

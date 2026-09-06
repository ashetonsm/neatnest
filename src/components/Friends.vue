<script setup lang="ts">
import { userStore } from '@/stores/user';
import FriendsList from './profile/FriendsList.vue';
import { onMounted, ref } from 'vue';
import { useAuth0 } from '@auth0/auth0-vue';

const store = userStore()
const friends = ref()

async function getFriends() {
    const data = await store.fetchFriends(store.getUser.PK)
    if (data.length) {
        return [data]
    } else {
        return []
    }
}

onMounted(async () => {
    const { user } = useAuth0();
    if (store.getUser == null || store.getUser == undefined) {
        await store.fetchUser(user.value?.sub as string, "%23METADATA")
    }
    friends.value = await getFriends()
})
</script>


<template>
    <FriendsList :friends="friends || []" :username="store.getUser.username" />
</template>

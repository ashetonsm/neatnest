<script setup lang="ts">
import { userStore } from '@/stores/user';
import FriendsList from './profile/FriendsList.vue';

const user = userStore()

</script>


<template>
    <FriendsList :friends="user.getFriends" :username="user.getUser.username"/>
</template>

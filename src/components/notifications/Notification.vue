<script setup lang="ts">
import { onMounted, ref, toRaw } from "vue";
import { userStore } from "@/stores/user";

const user = userStore();

const fetchedNotifications: any = ref<Array<any>>([]);

async function deleteNotification(notification: any) {
    // Running into issues with this due to everything being a proxy and the notifs being a list.
    console.log(notification)
}

onMounted(async () => {

    // fetchedNotifications.value = [
    //     {id: 1, title: 'New Trade', text: 'You have a new trade with xxx', type: 'Trade'}, 
    //     {id: 2, title: 'New Friend Request', text: 'You have a new friend request from xxx', type: 'Friend'}, 
    // ]
  fetchedNotifications.value = await user.getNotifications;
  console.log("fetchedNotifications.value:", fetchedNotifications.value)
});
</script>

<template>
    <h1 class="text-h4 font-weight-black ma-4" >Notifications:</h1>
    <v-list
        v-if="fetchedNotifications.length == 0"
    >
        <v-alert
        title="You have no notifications."
        type="info"
        class="ma-4"
        ></v-alert>
    </v-list>

    <v-list 
        v-else
        :items="fetchedNotifications"
        :item-props="true"
    >

    <v-alert
        v-for="(notification, i) in fetchedNotifications"
            :key="notification.id ?? i"
            :title="notification.title"
            :text="notification.content"
            type="info"
            class="ma-4"
            @click:close="deleteNotification(notification)"
            closable
        ></v-alert>
    </v-list>
</template>

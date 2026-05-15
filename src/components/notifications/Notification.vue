<script setup lang="ts">
import { onMounted, ref, toRaw } from "vue";
import { userStore } from "@/stores/user";

const user = userStore();

async function deleteNotification(notification: any) {
    // Running into issues with this due to everything being a proxy and the notifs being a list.
    console.log(notification)
}

const props = defineProps<{
  notifications: any;
}>();

</script>

<template>
    <h1 class="text-h4 font-weight-black ma-4" >Notifications:</h1>
    <v-list
        v-if="props.notifications.length == 0"
    >
        <v-alert
        key="singleNotif"
        title="You have no notifications."
        type="info"
        class="ma-4"
        ></v-alert>
    </v-list>

    <v-list 
        v-else
        :items="props.notifications"
        :item-props="true"
    >

    <v-alert
        v-for="(notification, i) in props.notifications"
            :key="notification.id ?? i"
            :title="notification.title"
            :text="notification.content"
            type="info"
            class="ma-4"
            @click:close="deleteNotification(notification)"
            closable
        >
    <v-btn :to=notification.url>View</v-btn>
    </v-alert>
    </v-list>
</template>

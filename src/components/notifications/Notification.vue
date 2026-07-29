<script setup lang="ts">
import { onMounted, ref, toRaw } from "vue";
import { userStore } from "@/stores/user";
import {DELETE_DATA} from "@/components/tools/ddbActions";
const user = userStore();

async function deleteNotification(notification: any) {
    try {
        await DELETE_DATA(notification)
    } catch (error: any) {
        console.error("Something went wrong deleting the notif:", error)
    }
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
        <v-list-item>
            <v-alert
            key="singleNotif"
            title="You have no notifications."
            type="info"
            class="ma-4"
            ></v-alert>
        </v-list-item>
    </v-list>

    <v-list 
        v-else
        :items="props.notifications"
        :item-props="true"
    >
        <v-list-item>
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
        </v-list-item>
    </v-list>
</template>

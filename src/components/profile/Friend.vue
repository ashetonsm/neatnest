<script setup lang="ts">
import { onMounted, ref } from "vue";
import { userStore } from "@/stores/user";
import FriendButtons from "./FriendButtons.vue";
import router from "@/router";
import { createNotification } from "../notifications/createNotification";
import { UPDATE_RELATIONSHIP } from "../tools/ddbActions";

const props = defineProps<{
  friend: any;
}>();

const user = userStore();
const textStatus = ref("")
const buttonValues = ref<{
  add: boolean,
  cancel: boolean,
  remove: boolean,
  accept: boolean,
  reject: boolean,
  block: boolean,
  unblock: boolean
}>({
  add: false,
  cancel: false,
  remove: false,
  accept: false,
  reject: false,
  block: false,
  unblock: false
})

/** Used to block and accept friends */
async function updateFriend(action: string) {
    var relationshipObj = { PK: '', relationshipUsername: '' }
    relationshipObj.PK = (props.friend.SK).match(/(?<=#)\S+/)[0]
    relationshipObj.relationshipUsername = props.friend.relationshipUsername

  await UPDATE_RELATIONSHIP(relationshipObj, user.getUser, action)
    .then(async () => {
      if (action == "add") {
        await createNotification(user.getUser, relationshipObj, "friendNew")
      }
      if (action == "accept") {
        await createNotification(user.getUser, relationshipObj, "friendAccept")
      }
    })
    .then(() => {
      router.go(0);
    })
}

onMounted(() => {
  console.log(props.friend)
    /*
    * 0 = Your incoming friend request is pending.
    * 1 = accepted
    * 2 = blocked for the target
    * 8 = blocked for the initiator
    * 9 = Your outgoing friend request is pending.
    */
  switch (parseInt(props.friend.status)) {
        case 0:
            textStatus.value = "Waiting on Them"
            buttonValues.value.cancel = true
            buttonValues.value.block = true
          return
        case 1:
            textStatus.value = "Friends"
            buttonValues.value.remove = true
            buttonValues.value.block = true
          return
        case 2:
            textStatus.value = "THEY BLOCKED YOU"
          return
        case 8:
            textStatus.value = "Blocked"
            console.log("You blocked this user.")
            buttonValues.value.unblock = true
          return
        case 9:
            textStatus.value = "Waiting on You"
            buttonValues.value.accept = true
            buttonValues.value.reject = true
            buttonValues.value.block = true
          return
        default:
            textStatus.value = "ERROR"
            buttonValues.value.add = true
            buttonValues.value.block = true
      }
})

</script>

<template>
    <v-badge 
        inline 
        v-if="$route.name == 'friends'"
        location="top right" 
        color="primary" 
        :content="textStatus"
    >
        <v-list-item 
            :key="'relation: ' + props.friend.relationshipUsername" 
            :title="props.friend.relationshipUsername.toString()"
            :to="'/profile/' + props.friend.relationshipUsername"
        >
        </v-list-item>
    </v-badge>

        <v-list-item v-else
            :key="'relation: ' + props.friend.relationshipUsername" 
            :title="props.friend.relationshipUsername.toString()"
            :to="'/profile/' + props.friend.relationshipUsername"
        >
        </v-list-item>
    <FriendButtons 
        v-if="$route.name == 'friends'" 
        :buttonValues="buttonValues" 
        :updateFriend="updateFriend" 
    />
</template>

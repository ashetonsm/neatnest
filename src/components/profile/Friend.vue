<script setup lang="ts">
import { userStore } from "@/stores/user";
import FriendButtons from "./FriendButtons.vue";
import router from "@/router";
import { createNotification } from "../notifications/createNotification";
import { UPDATE_RELATIONSHIP } from "../tools/ddbActions";

const props = defineProps<{
  friend: any;
  status: number;
}>();

const user = userStore();


/** Used to block and accept friends */
async function updateFriend(action: string) {
  var relationshipObj = { PK: '', relationshipUsername: '' }
  relationshipObj.PK = props.friend.PK
  relationshipObj.relationshipUsername = props.friend.username
  await UPDATE_RELATIONSHIP(relationshipObj, user.getUser, action)
    .then(async () => {
      if (action == "add") {
        await createNotification(user.getUser, relationshipObj, "friendNew")
      }
      if (action == "accept") {
        await createNotification(user.getUser, relationshipObj, "friendAccept")
      }
      if (action == "remove") {
      }
      if (action == "block") {
      }
    })
    .then(() => {
      router.go(0);
    })
}

</script>

<template>
  <v-badge inline v-if="$route.name == 'friends'" location="top right" color="primary" :content="props.status == 0 ? 'Waiting on You' :
    props.status == 1 ? 'Friends' :
      props.status == 2 ? 'Blocked' :
        props.status == 8 ? 'You are Blocked' :
          props.status == 9 ? 'Awaiting Reply' : 'ERROR'
    ">
    <v-list-item :key="'relation: ' + props.friend.username" :title="props.friend.username"
      :to="'/profile/' + props.friend.username">
    </v-list-item>
  </v-badge>

  <v-list-item v-else :key="'relation: ' + props.friend.username" :title="props.friend.username"
    :to="'/profile/' + props.friend.username">
  </v-list-item>
  <FriendButtons :updateFriend="updateFriend" :buttonStatus="props.status" />
</template>

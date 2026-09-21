<script setup lang="ts">
import { onMounted, ref } from 'vue';


const props = defineProps<{
  buttonStatus: number,
  updateFriend: any
}>();

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

onMounted(() => {
    /*
    * 0 = Your incoming friend request is pending.
    * 1 = accepted
    * 2 = blocked for the target
    * 8 = blocked for the initiator
    * 9 = Your outgoing friend request is pending.
    */
  switch (props.buttonStatus) {
        case 0:
          buttonValues.value.accept = true
          buttonValues.value.reject = true
          buttonValues.value.block = true
          return
        case 1:
          buttonValues.value.remove = true
          buttonValues.value.block = true
          return
        case 2:
          buttonValues.value.unblock = true
          return
        case 8:
          return
        case 9:
          buttonValues.value.cancel = true
          buttonValues.value.block = true
          return
        default:
          buttonValues.value.add = true
          buttonValues.value.block = true
      }
})

</script>

<template v-if="$route.name == 'friends' && buttonStatus == 1" >
  <v-btn 
    v-if="buttonValues.add" 
    text="Add"
    class="mx-auto"
    variant="elevated"
    color="success"
    :disabled="true"
  >Friends</v-btn>
  <v-btn 
    @click="updateFriend('remove')"
    text="Remove"
    class="mx-auto"
    variant="elevated"
    color="secondary"
  >Remove</v-btn>
  <v-btn 
    v-if="buttonValues.block" 
    @click="updateFriend('block')"
    text="Block"
    class="mx-auto"
    variant="elevated"
    color="error"
  >Block</v-btn>
<template>

  <v-btn 
    v-if="buttonValues.add" 
    @click="updateFriend('add')"
    text="Add"
    class="mx-auto"
    variant="elevated"
    color="success"
    >Add</v-btn>
  <v-btn 
    v-if="buttonValues.cancel" 
    @click="updateFriend('remove')"
    text="Cancel"
    class="mx-auto"
    variant="elevated"
    color="error"
  >Cancel</v-btn>
  <v-btn 
    v-if="buttonValues.remove" 
    @click="updateFriend('remove')"
    text="Remove"
    class="mx-auto"
    variant="elevated"
    color="error"
  >Remove</v-btn>
  <v-btn 
    v-if="buttonValues.accept" 
    @click="updateFriend('accept')"
    text="Accept"
    class="mx-auto"
    variant="elevated"
    color="success"
  >Accept</v-btn>
  <v-btn 
    v-if="buttonValues.reject" 
    @click="updateFriend('remove')"
    text="Reject"
    class="mx-auto"
    variant="elevated"
    color="error"
  >Reject</v-btn>
  <v-btn 
    v-if="buttonValues.block" 
    @click="updateFriend('block')"
    text="Block"
    class="mx-auto"
    variant="elevated"
    color="error"
  >Block</v-btn>
  <v-btn 
    v-if="buttonValues.unblock" 
    @click="updateFriend('remove')"
    text="Unblock"
    class="mx-auto"
    variant="elevated"
    color="error"
  >Unblock</v-btn>
</template>
</template>

<script setup lang="ts">
import { userStore } from "@/stores/user";
import { onMounted, ref } from "vue";
const user = userStore();
const tradeForm = ref()
const selectedFriend = ref(null)

const friends = ref<Array<any>>(user.getFriends);

onMounted(async () => {
  if (user.getFriends.length == 0) {
    friends.value = await user.fetchFriends(user.getUser.PK) || []
  }
})

async function validateTrade() {
    const { valid } = await tradeForm.value.validate()

    if (valid) alert('Trade is valid')

    try {

    } catch (error: any) {
        console.error(error);
    }
}


</script>

<template>
    <v-expansion-panels>
        <v-expansion-panel>
            <v-expansion-panel-title><span>New Trade</span></v-expansion-panel-title>
            <v-expansion-panel-text>
                <v-form @submit.prevent ref="tradeForm">
                    <v-select
                        v-model="selectedFriend"
                        label="Friends"
                        :items="friends"
                        item-title="username"
                        item-value="friends"
                        return-object
                        single-line
                    ></v-select>
                    <v-btn class="mt-2" text="Submit" type="submit" @click.prevent="validateTrade"></v-btn>
                </v-form>
            </v-expansion-panel-text>
        </v-expansion-panel>
    </v-expansion-panels>
</template>
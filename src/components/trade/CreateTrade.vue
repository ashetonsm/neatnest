<script setup lang="ts">
import { userStore } from "@/stores/user";
import { onMounted, ref, toRaw } from "vue";
import { UPDATE_TRADE } from "../tools/ddbActions";
import router from "@/router";
const user = userStore();
const tradeForm = ref()
const selectedFriend = ref()
const selectedPets = ref([])
const selectedItems = ref([])
// The table has the name currency right now, which is why this doesn't work.
// const selectedCredits = ref(user.getCredits)
const selectedCredits = ref(0)

const friends = ref<Array<any>>(user.getFriends);
const pets = ref<Array<any>>(user.getPets);
const items = ref<Array<any>>(user.getInventory);

onMounted(async () => {
  if (user.getFriends.length == 0) {
    friends.value = await user.fetchFriends(user.getUser.PK) || []
  }
  if (user.getPets.length == 0) {
    pets.value = await user.fetchPets(user.getUser.PK) || []
  }
  if (user.getInventory.length == 0) {
    items.value = await user.fetchInventory() || []
  }
})

async function createTrade() {
    try {
        // The actual content of the trade
        const contents = [
            {pets: toRaw(selectedPets.value)},
            {items: toRaw(selectedItems.value)},
            {credits: toRaw(selectedCredits.value)}
        ]
        console.log(contents)
        var friendObj = {PK: '', tradeUsername: ''}
        friendObj.PK = (selectedFriend.value.SK).match(/(?<=#)\S+/)[0]
        friendObj.tradeUsername = selectedFriend.value.relationshipUsername
        // The recipient, the sender, the contents, the action
        if (friendObj.PK !== undefined && friendObj.tradeUsername !== undefined) {
            await UPDATE_TRADE(friendObj, user.getUser, contents, 'create')
            .then(() => {
                router.push({name: 'trades'})
                router.go(0);
            })
        } else {
            console.error("Something is wrong with the data.", friendObj)
        }
    } catch (error: any) {
        console.error(error);
    }
}

async function validateTrade() {
    const { valid } = await tradeForm.value.validate()

    if (valid) alert('Trade is valid')
    try {
        createTrade()
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
                        item-title="relationshipUsername"
                        hint="Choose a Friend"
                        item-value="friends"
                        return-object
                        single-line
                        persistent-hint
                    ></v-select>
                    <v-select
                        v-model="selectedPets"
                        label="Pets"
                        :items="pets"
                        item-title="name"
                        hint="Choose Pet(s)"
                        item-value="pets"
                        return-object
                        single-line
                        persistent-hint
                    ></v-select>
                    <v-select
                        v-model="selectedItems"
                        label="Items"
                        :items="items"
                        item-title="name"
                        hint="Choose Item(s)"
                        item-value="items"
                        return-object
                        single-line
                        persistent-hint
                    ></v-select>
                    <v-number-input
                        :v-model="selectedCredits"
                        hint="Select Credit Amount"
                        :max="999"
                        :min="0"
                        :step="1"
                        persistent-hint
                    ></v-number-input>
                    <v-btn class="mt-2" text="Submit" type="submit" @click.prevent="validateTrade"></v-btn>
                </v-form>
            </v-expansion-panel-text>
        </v-expansion-panel>
    </v-expansion-panels>
</template>
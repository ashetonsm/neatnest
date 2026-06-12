<script setup lang="ts">
import { userStore } from "@/stores/user";
import { onMounted, ref, toRaw } from "vue";
import { UPDATE_TRADE } from "../tools/ddbActions";
import router from "@/router";
import { createNotification } from "../notifications/createNotification";
const user = userStore();
const tradeForm = ref()
const selectedFriend = ref()
const selectedPets = ref([])
const selectedItems = ref([])
const selectedCredits = ref(0)


const friends = ref<Array<any>>(user.getFriends);
const pets = ref<Array<any>>(user.getPets);
const items = ref<Array<any>>(user.getInventory);

const creditRules = ref([
    (v: number) => (-1 < v && v < 1001) || 'Min credits: 0; Max credits: 1000',
    (v: number) => (user.getCredits >= v) || "You don't have enough credits to offer!",
])

const itemRules = ref([
    (v: any) => (
        v.value || 
        selectedItems.value.length !== 0 ||
        selectedPets.value.length !== 0) || 
        selectedCredits.value !== 0 ||
        "You can't trade nothing!",
])

const petRules = ref([
    (v: any) => (
        v.value || 
        selectedPets.value.length !== 0 ||
        selectedItems.value.length !== 0) || 
        selectedCredits.value !== 0 ||
        "You can't trade nothing!",
])

onMounted(async () => {
    if (user.getFriends.length == 0) {
        friends.value = await user.fetchFriends(user.getUser.PK) || []
        if (friends.value.length) {
            friends.value.filter((friend: { status: number; }) => {friend.status == 1})
        }
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
            { pets: toRaw(selectedPets.value) },
            { items: toRaw(selectedItems.value) },
            { credits: selectedCredits.value}
        ]
        var friendObj = { PK: '', tradeUsername: '' }
        friendObj.PK = (selectedFriend.value.SK).match(/(?<=#)\S+/)[0]
        friendObj.tradeUsername = selectedFriend.value.relationshipUsername
        // The recipient, the sender, the contents, the action
        if (friendObj.PK !== undefined && friendObj.tradeUsername !== undefined) {
            await UPDATE_TRADE(friendObj, user.getUser, contents, 'create')
              .then(async () => {
                    await createNotification(user.getUser, friendObj, "tradeNew")
            })
                .then(() => {
                    router.push({ name: 'trades' })
                    router.go(0);
                })
        } else {
            console.error("Something is wrong with the data.", friendObj)
        }
    } catch (error: any) {
        console.error(error);
    }
}

/**
 * Can't trade with someone you blocked
 */
async function validateTrade() {
    const { valid } = await tradeForm.value.validate()
    if (valid) {
        alert('Trade is valid')
        createTrade()
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
                        :rules="[v => !!v || 'You must select a friend!']"
                        return-object
                        single-line persistent-hint></v-select>
                    <v-select 
                        v-model="selectedPets" 
                        label="Pets" 
                        :items="pets" 
                        item-title="name" 
                        hint="Choose Pet(s)"
                        item-value="pets" 
                        :rules="petRules"
                        return-object 
                        single-line 
                        persistent-hint 
                        multiple></v-select>
                    <v-select 
                        v-model="selectedItems" 
                        label="Items" 
                        :items="items" 
                        item-title="name"
                        hint="Choose Item(s)" 
                        item-value="items" 
                        :rules="itemRules"
                        return-object 
                        single-line 
                        persistent-hint
                        multiple></v-select>
                    <v-number-input 
                        :v-model="selectedCredits"
                        :modelValue="selectedCredits" 
                        v-on:update:model-value="(val) => selectedCredits = val"
                        hint="Select Credit Amount" 
                        :max="1000" 
                        :min="0" 
                        :step="1"
                        :rules="creditRules"
                        persistent-hint
                    ></v-number-input>
                    <v-btn class="mt-2" text="Submit" type="submit" @click.prevent="validateTrade"></v-btn>
                </v-form>
            </v-expansion-panel-text>
        </v-expansion-panel>
    </v-expansion-panels>
</template>
<script setup lang="ts">
import { userStore } from "@/stores/user";
import { onMounted, ref } from "vue";
import { UPDATE_TRADE } from "../tools/ddbActions";
import { createNotification } from "../notifications/createNotification";
import { useRouter } from "vue-router";
const store = userStore();
const tradeForm = ref()
const selectedFriend = ref()
const selectedPets = ref([])
const selectedItems = ref([])
const selectedCredits = ref(0)


const friends = ref<Array<any>>([]);
const pets = ref<Array<any>>(store.getPets);
const items = ref<Array<any>>(store.getInventory);
const router = useRouter()

const creditRules = ref([
    (v: number) => (-1 < v && v < 1001) || 'Min credits: 0; Max credits: 1000',
    (v: number) => (store.getCredits >= v) || "You don't have enough credits to offer!",
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

async function getFriends() {
  const data = await store.fetchFriends(store.getUser.PK)
  if (data.length) {
    return data
  } else {
    return [data]
  }
}

async function getInventory() {
  const data = await store.fetchInventory(store.getUser.PK)
  if (data.length) {
    return data
  } else {
    return [data]
  }
}
async function getPets() {
  const data = await store.fetchPets(store.getUser.PK)
  if (data.length) {
    return data
  } else {
    return [data]
  }
}

onMounted(async () => {
    const fetchedFriends = await getFriends()
    if (fetchedFriends.length) {
        friends.value = fetchedFriends.filter((f: { status: number; }) => f.status == 1)
    }
    if (store.getPets.length == 0) {
        pets.value = await getPets()
    }
    if (store.getInventory.length == 0) {
        items.value = await getInventory()
    }
})

async function createTrade() {
    try {
        // The actual content of the trade
        const contents = [
            { pets: selectedPets.value },
            { items: selectedItems.value },
            { credits: selectedCredits.value}
        ]
        var friendObj = { PK: '', tradeUsername: '' }
        friendObj.PK = (selectedFriend.value.SK).match(/(?<=#)\S+/)[0]
        friendObj.tradeUsername = selectedFriend.value.relationshipUsername
        // The recipient, the sender, the contents, the action
        if (friendObj.PK !== undefined && friendObj.tradeUsername !== undefined) {
            await UPDATE_TRADE(friendObj, store.getUser, contents, 'create')
              .then(async () => {
                    await createNotification(store.getUser, friendObj, "tradeNew")
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
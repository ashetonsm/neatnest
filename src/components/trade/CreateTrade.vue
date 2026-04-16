<script setup lang="ts">
import { userStore } from "@/stores/user";
import { onMounted, ref } from "vue";
import { UPDATE_TRADE } from "../tools/ddbActions";
const user = userStore();
const tradeForm = ref()
const selectedFriend = ref(null)
const selectedPets = ref(null)
const selectedItems = ref(null)
const selectedCredits = ref(user.getCredits)

const friends = ref<Array<any>>(user.getFriends);
const pets = ref<Array<any>>(user.getPets);
const items = ref<Array<any>>(user.getInventory);
const tradeContents = ref<Array<any>>([]);

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
        const contents = [
            selectedFriend._rawValue, 
            selectedPets._rawValue, 
            selectedPets._rawValue, 
            {credits: selectedCredits.value}
        ]
        console.log(contents)
        await UPDATE_TRADE(selectedFriend.value, user.getUser, contents, 'create')
    } catch (error: any) {
        console.error(error);
    }
}

async function validateTrade() {
    const { valid } = await tradeForm.value.validate()

    if (valid) alert('Trade is valid')
    console.log(selectedPets.value)
    console.log(selectedFriend.value)
    console.log(selectedItems.value)
    console.log(selectedCredits.value)

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
                    ></v-select>
                    <v-number-input
                        v-model="selectedCredits"
                        :max="999"
                        :min="0"
                        :step="1"
                    ></v-number-input>
                    <v-btn class="mt-2" text="Submit" type="submit" @click.prevent="validateTrade"></v-btn>
                </v-form>
            </v-expansion-panel-text>
        </v-expansion-panel>
    </v-expansion-panels>
</template>
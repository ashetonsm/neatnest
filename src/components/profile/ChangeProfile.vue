<script setup lang="ts">
import router from "@/router";
import { userStore } from "@/stores/user";
import { ref } from "vue";
import { PUT_DATA } from "../tools/ddbActions";
const user = userStore();
const usernameForm = ref()
const bioForm = ref()
const username = ref(user.getUser!.username)
const bio = ref(user.getUser!.bio)


async function validateUsername() {
    const { valid } = await usernameForm.value.validate()

    if (valid) alert('Form is valid')

    // Update the username
    var updatedUser = user.getUser!;
    try {
        updatedUser.username = username.value;
        await PUT_DATA(updatedUser).then(async () => {
            router.push(`/profile/${updatedUser.username}`)
        });
    } catch (error: any) {
        console.error(error);
    }
}

async function validateBio() {
    const { valid } = await bioForm.value.validate()

    if (valid) alert('Form is valid')

    var updatedUser = user.getUser!;
    try {
        updatedUser.bio = bio.value;
        await PUT_DATA(updatedUser).then(async () => {
            router.push(`/profile/${updatedUser.username}`)
            router.go(0);
        });
    } catch (error: any) {
        console.error(error);
    }
}

</script>

<template>
    <!-- Change your username -->
    <v-expansion-panels>
        <v-expansion-panel>
            <v-expansion-panel-title><span>Change username</span></v-expansion-panel-title>
            <v-expansion-panel-text>
                <v-form @submit.prevent ref="usernameForm">
                    <v-text-field v-model="username" label="Username"
                        :placeholder="user.getUser!.username"></v-text-field>
                    <v-btn class="mt-2" text="Submit" type="submit" @click.prevent="validateUsername"></v-btn>
                </v-form>
            </v-expansion-panel-text>
        </v-expansion-panel>
    </v-expansion-panels>

    <!-- Change your description -->
    <v-expansion-panels>
        <v-expansion-panel>
            <v-expansion-panel-title><span>Change description</span></v-expansion-panel-title>
            <v-expansion-panel-text>
                <v-form @submit.prevent ref="bioForm">
                    <v-text-field v-model="bio" label="Bio" :placeholder="user.getUser!.bio!"></v-text-field>
                    <v-btn class="mt-2" text="Submit" type="submit" @click.prevent="validateBio"></v-btn>
                </v-form>
            </v-expansion-panel-text>
        </v-expansion-panel>
    </v-expansion-panels>
</template>
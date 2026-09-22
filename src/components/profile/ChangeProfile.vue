<script setup lang="ts">
import router from "@/router";
import { userStore } from "@/stores/user";
import { ref } from "vue";
import { PUT_DATA } from "../tools/ddbActions";
const store = userStore();
const emailForm = ref()
const bioForm = ref()
const email = ref("")
const bio = ref(store.getUser!.bio)


async function validateEmail() {
    try {
        const { valid } = await emailForm.value.validate()

        if (valid) {


        }
    } catch (error: any) {
        console.error(error);
    }
}

async function validateBio() {
    const { valid } = await bioForm.value.validate()

    if (valid) {
        var updatedUser = store.getUser!;
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
}

</script>

<template>
    <!-- Change your email address -->
    <v-expansion-panels>
        <v-expansion-panel>
            <v-expansion-panel-title><span>Change email</span></v-expansion-panel-title>
            <v-expansion-panel-text>
                <v-form @submit.prevent ref="usernameForm">
                    <v-text-field v-model="email" label="Email"
                        placeholder="email@email.com"></v-text-field>
                    <v-btn class="mt-2" text="Submit" type="submit" @click.prevent="validateEmail"></v-btn>
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
                    <v-text-field v-model="bio" label="Bio" :placeholder="store.getUser!.bio!"></v-text-field>
                    <v-btn class="mt-2" text="Submit" type="submit" @click.prevent="validateBio"></v-btn>
                </v-form>
            </v-expansion-panel-text>
        </v-expansion-panel>
    </v-expansion-panels>
</template>
<script setup lang="ts">
import { userStore } from "@/stores/user";
import { onMounted, ref } from "vue";
import { useAuth0 } from "@auth0/auth0-vue";
const store = userStore();
const settingsForm = ref()
const email = ref("")
const bio = ref(store.getUser!.bio)

const { getAccessTokenSilently } = useAuth0()


onMounted(async () => {
    const res = await getToken()
})

async function getToken() {
    try {
        const options = {
            authorizationParams:
            {
                redirect_uri: import.meta.env.VITE_AUTH0_CALLBACK_URL,
                audience: 'https://nnneato.com/dev-api/'
            }
        }
        const token = await getAccessTokenSilently(options);
        console.log(token)
        return fetch(`https://nnneato.com/dev-api/api/v2/users/${store.getUser.PK}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(async (response) => {
                console.log(await response.text())
                return response
            })
            .then((res) => {
                console.log(res)
            })
    } catch (error: any) {
        console.error(error);
    }
};


const emailRules = ref([
    (v: string) => (v !== "") || 'Email cannot be blank.',
    (v: string) => (/.+@.+\..+/.test(v)) || 'Invalid email.'
])

const bioRules = ref([
    (v: string) => (v !== "") || 'Bio cannot be blank.'
])

async function validateChanges() {
    try {
        const { valid } = await settingsForm.value.validate()

        if (valid) {
        }
        console.log("settingsForm.value:", valid, settingsForm.value)

    } catch (error: any) {
        console.error(error);
    }
}

</script>

<template>
    <!-- Change your email address -->
    <v-expansion-panels>
        <v-expansion-panel>
            <v-expansion-panel-title><span>Change User Settings</span></v-expansion-panel-title>
            <v-expansion-panel-text>
                <v-form @submit.prevent ref="settingsForm">
                    <v-text-field v-model="email" label="Email" placeholder="email@email.com"
                        :rules="emailRules"></v-text-field>
                    <v-btn class="mt-2" text="Submit" type="submit" @click.prevent="validateChanges"></v-btn>

                    <!-- Change your description -->
                    <v-text-field v-model="bio" label="Bio" :placeholder="store.getUser!.bio!"
                        :rules="bioRules"></v-text-field>
                    <v-btn class="mt-2" text="Submit" type="submit" @click.prevent="validateChanges"></v-btn>

                </v-form>
            </v-expansion-panel-text>
        </v-expansion-panel>
    </v-expansion-panels>

</template>
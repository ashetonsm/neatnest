import { ref } from 'vue';
import { defineStore } from 'pinia';
import { generateClient } from 'aws-amplify/api';
import type { Schema } from '../../amplify/data/resource'
import { getCurrentUser } from 'aws-amplify/auth';

export const userStore = defineStore('user', {
    state: () => ({
        user: ref<any>(null),
        pets: ref<any>(null),
        inventory: ref<any>(null),
        friends: ref<any>(null),
    }),
    getters: {
        getUser: (state: { user: any }) => state.user,
        getPets: (state: { pets: any }) => state.pets,
        getInventory: (state: { inventory: any }) => state.inventory,
        getFriends: (state: { friends: any }) => state.friends,
    },
    actions: {
        async amplifyGetCurrentUser() {
            try {
                const { userId } = await getCurrentUser();

                // If you define this before userStore, you'll get the Amplify Not Configured error.
                const client = generateClient<Schema>();

                await client.models.User.get({ id: userId })
                    .then((u) => {
                        console.log("userStore got the following user: ", u.data)

                        // Needs an exclaimation point otherwise you get a nullable error
                        this.user = u.data!
                    });
            } catch (error: any) {
                console.error(error)
            }
        },

        async fetchPets() {
            const client = generateClient<Schema>();
            await this.amplifyGetCurrentUser()

            try {
                await client.models.Pet.listPetsByOwnerAndName(
                    { owner: this.user.id, },
                    { authMode: "userPool", })
                    .then((res) => {
                        this.pets = res.data
                    })
            } catch (error: any) {
                console.error(error)
            }
        },

        async fetchInventory() {
            const client = generateClient<Schema>();
            await this.amplifyGetCurrentUser()

            await client.models.Item.listItemsByOwnerAndName(
                {
                    owner: this.user.id
                },
                {
                    headers: {
                        'Access-Control-Allow-Headers': '*',
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Methods': '*',
                        'Content-Type': 'application/json',
                    },
                    authMode: 'userPool'
                }
            )
                .then((res: { data: any; }) => {
                    return this.inventory = res.data
                })
                .catch((error: any) => {
                    console.log("No items found for this user.")
                    return this.inventory = []
                });
        }
    }
});
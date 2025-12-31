import { ref } from 'vue';
import { defineStore } from 'pinia';
import { generateClient } from 'aws-amplify/api';
import type { Schema } from '../../amplify/data/resource'
import { getCurrentUser } from 'aws-amplify/auth';
import type { Nullable } from 'node_modules/@aws-amplify/data-schema/dist/esm/ModelField';

export const userStore = defineStore('user', {
    state: () => ({
        user: ref<any>(null),
        pets: ref<any>(null),
        inventory: ref<any>(null),
        credits: ref<any>(null),
        friends: ref<String[]>([]),
    }),
    getters: {
        getUser: (state: { user: any }) => state.user,
        getPets: (state: { pets: any }) => state.pets,
        getInventory: (state: { inventory: any }) => state.inventory,
        getCredits: (state: { credits: any }) => state.credits,
        getFriends: (state: { friends: any }) => state.friends,
    },
    actions: {
        async amplifyGetCurrentUser() {
            try {
                // This isn't null. It's verified fine to use.
                const { userId } = await getCurrentUser();

                // If you define this before userStore, you'll get the Amplify Not Configured error.
                const client = generateClient<Schema>();

                await client.models.User.get({ id: userId })
                    .then((u) => {
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
        },

        async fetchCredit() {
            const client = generateClient<Schema>();
            await this.amplifyGetCurrentUser()

            await client.models.Credit.cashByOwner(
                { owner: this.user.id },
                { authMode: 'userPool' }
            )
                .then(async (res: { data: any; }) => {
                    if (res.data.length) {
                        console.log("Found existing Credit.")
                        return this.credits = res.data[0]
                    } else {
                        console.log("No Credit found for this user. Creating an entry...")
                        await client.models.Credit.create(
                            {
                                owner: this.user.id,
                                amount: 0
                            }
                        )
                            .then((res: { data: any; }) => {
                                return this.credits = res.data
                            })
                    }
                })
                .catch(async (error: any) => {
                    console.error("Oops, something went wrong!")
                    console.error("Error: ", error)
                });
        },

        async fetchFriends() {
            const client = generateClient<Schema>();
            await this.amplifyGetCurrentUser()

            var friendListA: Array<Schema["User"]["type"]> = []
            var friendListB: Array<Schema["User"]["type"]> = []
            var friendList: Array<any> = []

            // Search by friendA
            await client.models.Friend.friendByfriendA(
                { friendA: this.user.id },
                { authMode: 'userPool' }
            )
                .then((res: { data: any; }) => {
                    if (res.data.length) {
                        friendListA = res.data
                    } else {
                        console.log("No friendA friends found for this user.")
                    }
                })
                .catch((error: any) => {
                    console.log("Error: ", error)
                });

            // Search by friendB
            await client.models.Friend.friendByfriendB(
                { friendB: this.user.id },
                { authMode: 'userPool' }
            )
                .then((res: { data: any; }) => {
                    if (res.data.length) {
                        friendListB = res.data
                    } else {
                        console.log("No friendB friends found for this user.")
                    }
                })
                .catch((error: any) => {
                    console.log("Error: ", error)
                });

            // Friend List filtering
            friendList = [...friendListA, ...friendListB]
            console.log("Raw FriendList: ", friendList)

            const uniqueArray = [...new Set(friendList)];
            friendList = Array.from(uniqueArray)
            console.log("Setified FriendList: ", friendList)
            

            friendList.forEach(async friend => {
                console.log(friend.friendA)
                await client.models.User.get({ id: friend.friendA })
                    .then((res) => {
                        console.log(res.data)
                        if (res.data?.username) {
                            this.friends.push(res.data!.username)
                        }
                        });
                    })
        }
    }
});
import { ref } from 'vue';
import { defineStore } from 'pinia';
import { generateClient } from 'aws-amplify/api';
import type { Schema } from '../../amplify/data/resource'
import { getCurrentUser } from 'aws-amplify/auth';

export const userStore = defineStore('user', {
    state: () => ({
        user: ref<Schema["User"]["type"] | null>(null),
        pets: ref<any>(null),
        inventory: ref<any>(null),
        credits: ref<any>(null),
        friends: ref<Array<{username: string, friendObject: Schema["Friend"]["type"]}>>([]),
    }),
    getters: {
        getUser: (state: { user: Schema["User"]["type"] | null }) => state.user,
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
                        this.user! = u.data!
                    });
            } catch (error: any) {
                console.error(error)
            }
        },

        async fetchPets() {
            const client = generateClient<Schema>();
            if (!this.user!) {
                await this.amplifyGetCurrentUser()
            }

            try {
                await client.models.Pet.listPetsByOwnerAndName(
                    { owner: this.user!.id, },
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
            if (!this.user!) {
                await this.amplifyGetCurrentUser()
            }

            await client.models.Item.listItemsByOwnerAndName(
                {
                    owner: this.user!.id
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
            if (!this.user!) {
                await this.amplifyGetCurrentUser()
            }

            await client.models.Credit.cashByOwner(
                { owner: this.user!.id },
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
                                owner: this.user!.id,
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

        async fetchFriends(inputUserID: string) {
            const client = generateClient<Schema>(); 
            
            var friendList: Array<any> = []

            // Search by friendA
            await client.models.Friend.friendByfriendA(
                { friendA: inputUserID },
                { authMode: 'userPool' }
            )
                .then((res: { data: any; }) => {
                    if (res.data.length) {
                        friendList = res.data
                    }
                })
                .catch((error: any) => {
                    console.log("Error: ", error)
                });

            // Search by friendB
            await client.models.Friend.friendByfriendB(
                { friendB: inputUserID },
                { authMode: 'userPool' }
            )
                .then((res: { data: any; }) => {
                    if (res.data.length) {
                        friendList = [...friendList, ...res.data]
                    }
                })
                .catch((error: any) => {
                    console.log("Error: ", error)
                });
                
            var idSet: Set<{id: {S: String}}> = new Set()
                
            // Filter for unique objects
            friendList.forEach(async pair => {
                var entry = {
                    id: {
                        S: pair.friendA,
                        friendObject: pair
                    }
                }
                // If friend A is NOT the current user
                if (pair.friendA !== inputUserID) {
                    // This entry isn't already in the set
                    if (!idSet.has(entry)) {
                        // Add it to the set.
                        idSet.add(entry)
                    }
                } else {
                    // Replace with friend B.
                    entry.id.S = pair.friendB
                    // This entry isn't already in the set
                    if (!idSet.has(entry)) {
                        // Add it to the set.
                        idSet.add(entry)
                    }
                }
            })
            const idList = Array.from(idSet)
            const b = JSON.stringify({
                userIds: idList,
                tableName: import.meta.env.VITE_USER_TABLE,
                httpMethod: "POST"
            })

            const res = await fetch(`${import.meta.env.VITE_BATCH_UN_LAMBDA}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: b
            })
            if (res.ok) {
                var data = await res.json();
                data = JSON.parse(data.body)
                console.log("User store found these friends: ", data.friends)

                if (inputUserID == this.user!.id) {
                    this.friends = data.friends
                }

                return data.friends

            } else {
                console.error("Error: ", res.status)
            }
        }
    }
});
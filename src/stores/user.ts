import { ref } from 'vue';
import { defineStore } from 'pinia';
import { GET_BY_PK_SK } from '@/components/tools/ddbActions';

export const userStore = defineStore('user', {
    state: () => ({
        user: ref<any | null>(null),
        shop: ref<any | null>(null),
        pets: ref<any>(null),
        inventory: ref<any>(null),
        credits: ref<any>(0),
        trades: ref<Array<any>>([]),
        friends: ref<Array<{ username: string, friendObject: any }>>([]),
    }),
    getters: {
        getUser: (state: { user: any | null }) => state.user,
        getShop: (state: { shop: any | null }) => state.shop,
        getPets: (state: { pets: any }) => state.pets,
        getInventory: (state: { inventory: any }) => state.inventory,
        getCredits: (state: { credits: any }) => state.credits,
        getTrades: (state: { trades: Array<any> }) => state.trades,
        getFriends: (state: { friends: any }) => state.friends,
    },
    actions: {
        async fetchUser(PK: string, SK: string) {
            try {
                const userMetadata = await GET_BY_PK_SK(PK, SK)
                this.user = userMetadata
                return userMetadata
            } catch (error: any) {
                console.error("User not authenticated. Cannot fetch info.")
                // console.error(error)
            }
        },

        async fetchShop(inputOwnerId: string) {
            try {
                /*
                await client.models.Shop.shopByOwnerId({ ownerId: inputOwnerId as string})
                .then(async (res: { data: any; }) => {
                    if (res.data.length) {
                        console.log("Found existing Shop.")
                        if (inputOwnerId as string == this.getUser?.id) {
                            this.shop = res.data[0] as unknown as any
                        }
                        console.log(res.data[0])
                        return res.data[0] as unknown as any
                    } else {
                        console.log("No Shop found for this user. Creating a shop...")
                    await client.models.Shop.create(
                        {
                            ownerId: this.user!.id,
                            name: this.user?.username,
                            items: JSON.stringify([])
                        }
                    )
                    .then((res: { data: any; }) => {
                        if (inputOwnerId as string == this.getUser?.id) {
                            this.shop = res.data[0] as unknown as any
                        }
                        console.log(res.data[0])
                        
                        return res.data[0] as unknown as any
                    })
                }
            })
            */
            } catch (error: any) {
                console.error("Oops, something went wrong!")
                console.error("Error: ", error)
            }
        },

        async fetchPets() {

            try {
                /*
                await client.models.Pet.listPetsByOwnerAndName(
                    { ownerId: this.user!.id, },
                    { authMode: "userPool", })
                    .then((res) => {
                        this.pets = res.data
                    })
                    */
            } catch (error: any) {
                console.error(error)
            }
        },

        async fetchTrades() {
            try {
                /*
                var tradeArray: Array<any> = []
                // Get trades where this user is the recipient
                await client.models.Trade.tradeByRecipient(
                    { recipient: this.user!.id, },
                    { authMode: "userPool", })
                    .then((res: { data: any; }) => {
                        if (res.data.length) {
                            tradeArray = res.data
                        }
                    })
                    
                    // Get trades where this user is the sender
                    await client.models.Trade.tradeBySender(
                        { sender: this.user!.id, },
                        { authMode: "userPool", })
                        .then((res: { data: any; }) => {
                            if (res.data.length) {
                                tradeArray = [...tradeArray, ...res.data]
                            }
                        })
                        

                        var idSet: Set<any> = new Set()
                        
                        // Filter for unique objects
                        tradeArray.forEach(async entry => {
                            // If the trade's recipient is NOT the current user
                            if (entry.recipient !== this.user?.id) {
                                // This entry isn't already in the set
                                if (!idSet.has(entry)) {
                                    // Add it to the set.
                                    idSet.add(entry)
                                }
                            } else {
                                // This entry isn't already in the set
                            if (!idSet.has(entry)) {
                                // Add it to the set.
                                idSet.add(entry)
                            }
                        }
                    })
                    const tradeList = Array.from(idSet)
                    
                    this.trades = tradeList
                    
                    */
            } catch (error: any) {
                this.trades = []
                console.error(error)
                console.error(this.trades)
            }
        },

        async fetchInventory() {
            /*
            await client.models.Item.listItemsByOwnerAndName(
                {
                    ownerId: this.user!.id
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
        */
        },

        async fetchCredit() {
            /*
            await client.models.Credit.cashByOwner(
                { ownerId: this.user!.id },
                { authMode: 'userPool' }
            )
            .then(async (res: { data: any; }) => {
                if (res.data.length) {
                    console.log("Found existing Credit.")
                    return this.credits = parseInt(res.data[0].amount)
                } else {
                    console.log("No Credit found for this user. Creating an entry...")
                await client.models.Credit.create(
                    {
                        ownerId: this.user!.id,
                        amount: 0
                    }
                )
                .then((res: { data: any; }) => {
                    return this.credits = parseInt(res.data.amount)
                })
            }
        })
        .catch(async (error: any) => {
            console.error("Oops, something went wrong!")
            console.error("Error: ", error)
        });
        */
        },

        async fetchFriends(inputUserID: string) {
            // This will all be reworked.

        }
    }
});
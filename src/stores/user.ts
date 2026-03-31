import { ref } from 'vue';
import { defineStore } from 'pinia';
import { PUT_DATA, GET_BY_PK_SK, LIST_BY_PK_SK } from '@/components/tools/ddbActions';

export const userStore = defineStore('user', {
    state: () => ({
        user: ref<any | null>(null),
        shop: ref<any | null>(null),
        pets: ref<Array<any>>([]),
        inventory: ref<Array<any>>([]),
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
        async fetchUser(PK: string, SK: string, inputUser?: any) {
            try {
                const retrievedUser = await GET_BY_PK_SK(PK, SK)
                if (!retrievedUser) {
                    if (inputUser.value) {
                        const newUser = await PUT_DATA({
                            PK: PK,
                            SK: '#METADATA',
                            Email: inputUser.value.email,
                            Username: inputUser.value.name,
                            Avatar: inputUser.value.image,
                            CreatedAt: new Date().toISOString(),
                            Currency: 0,
                            Gender: 'unassigned',
                            ItemsRemaining: 3,
                            PetsRemaining: 3,
                            Type: 'Metadata',
                            UpdatedAt: new Date().toISOString(),
                        })
                        this.user = newUser
                        return newUser
                    }
                }
                this.user = retrievedUser
                return retrievedUser
            } catch (error: any) {
                console.error("An error occurred in fetchUser: ", error)
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
                const pets = await LIST_BY_PK_SK(this.getUser.PK, "PET")
                try {
                    console.log("The pets from user.ts:", pets)
                    let updatedPets: any[] = []
                    pets!.forEach(pet => {
                        updatedPets.push(pet)
                    });
                    this.pets = updatedPets
                    return this.pets
                } catch (error: any) {
                    console.error("Error fetching pets: ", error)
                    return this.pets
                }
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

            // headers: {
            //     'Access-Control-Allow-Headers': '*',
            //     'Access-Control-Allow-Origin': '*',
            //     'Access-Control-Allow-Methods': '*',
            //     'Content-Type': 'application/json',
            // },

            const inventory = await LIST_BY_PK_SK(this.getUser.PK, "ITEM")

            try {
                console.log("The inventory from user.ts:", inventory)
                let updatedInventory: any[] = []
                inventory!.forEach(item => {
                    updatedInventory.push(item)
                });
                this.inventory = updatedInventory
                return this.inventory
            } catch (error: any) {
                console.error("Error fetching the inventory: ", error)
                return this.inventory
            }
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
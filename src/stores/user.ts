import { ref } from 'vue';
import { defineStore } from 'pinia';
import { GET_BY_PK_SK, GET_BY_USERNAME, LIST_SELLING_BY_PK, PUT_DATA } from '@/components/tools/ddbActions';

export const userStore = defineStore('user', {
    state: () => ({
        user: ref<any | null>(null),
        shop: ref<any | null>(null),
        pets: ref<Array<any>>([]),
        inventory: ref<Array<any>>([]),
        notifications: ref<Array<any>>([]),
        credits: ref<number>(0),
        trades: ref<Array<any>>([]),
        friends: ref<Array<any>>([]),
    }),
    getters: {
        getUser: (state: { user: any | null }) => state.user,
        getShop: (state: { shop: any | null }) => state.shop,
        getPets: (state: { pets: any }) => state.pets,
        getInventory: (state: { inventory: any }) => state.inventory,
        getNotifications: (state: { notifications: any }) => state.notifications,
        getCredits: (state: { credits: number }) => state.credits,
        getTrades: (state: { trades: any }) => state.trades,
        getFriends: (state: { friends: any }) => state.friends,
    },
    actions: {
        /**
         * Used in the Callback function after login. Should noot be used anywhere else.
         * @param PK The Primary Key of the user to fetch
         * @param SK The Sort Key of the user to fetch
         * @param inputUser The initial values when a user creates an account for the first time
         * @returns 
         */
        async fetchUser(PK: string, SK: string, inputUser?: any) {
            try {
                // This is the PK value for any user
                console.log("inputUser", inputUser)
                const retrievedUser = await GET_BY_PK_SK(inputUser.sub, SK)
                if (!retrievedUser) {
                    if (inputUser.value) {
                        const newUser = await PUT_DATA({
                            PK: PK,
                            SK: '%23METADATA',
                            email: inputUser.value.email,
                            username: inputUser.value.nickname.toLowerCase().replace(/\s/g, "_").replace(/\W+/g, ""),
                            url: inputUser.value.picture,
                            bio: "Hi, I'm new! Nice to meet you!",
                            createdAt: new Date().getTime(),
                            credits: 0,
                            itemsRemaining: 3,
                            petsRemaining: 3,
                            type: 'Metadata',
                            updatedAt: new Date().getTime(),    // Stores when creation credits were last added
                            lastLogin: new Date().getTime(),
                        })
                        this.user = newUser
                        this.credits = 0
                        await this.fetchFriends(PK)
                        await this.fetchNotifications()
                        return newUser
                    }
                } else {
                    this.user = retrievedUser
                    this.credits = retrievedUser.credits
                    await this.fetchFriends(PK)
                    await this.fetchNotifications()
                    console.log(retrievedUser)
                    return retrievedUser
                }
            } catch (error: any) {
                console.error("An error occurred in fetchUser: ", error)
            }
        },

        async fetchPets(PK: string) {
            const pets = await GET_BY_PK_SK(PK, "PET")
            try {
                if (PK == this.user.PK) {
                    this.pets = pets || []
                    return this.pets
                }
                return pets
            } catch (error: any) {
                console.error(error)
            }
        },

        async fetchTrades() {
            const trades = await GET_BY_PK_SK(this.getUser.PK, "TRADE")
            try {
                this.trades = trades || []
                return this.trades
            } catch (error: any) {
                console.error(error)
            }
        },

        async fetchInventory() {
            const inventory = await GET_BY_PK_SK(this.getUser.PK, "ITEM")
            try {
                this.inventory = inventory || []
                return this.inventory
            } catch (error: any) {
                console.error("Error fetching the inventory: ", error)
                return this.inventory
            }
        },

        async fetchNotifications() {
            const notifications = await GET_BY_PK_SK(this.getUser.PK, "NOTIFICATION")
            try {
                this.notifications = notifications || []
                return this.notifications
            } catch (error: any) {
                console.error("Error fetching the notifications: ", error)
                return this.notifications
            }
        },

        async fetchShop(shopkeeperUsername: string) {
            const shopkeeper = await GET_BY_USERNAME(shopkeeperUsername, "%23METADATA")
            const inventory = await LIST_SELLING_BY_PK(
                shopkeeperUsername == "GENERALSTORE" ? "GENERALSTORE" : shopkeeper?.PK)
            try {
                return inventory || []
            } catch (error: any) {
                console.error("Error fetching the shop's inventory: ", error)
                return []
            }
        },

        async fetchFriends(PK: string) {
            const friends = await GET_BY_PK_SK(PK, "RELATIONSHIP")
            try {
                if (PK == this.user.PK) {
                    this.friends = friends || []
                    return this.friends
                }
                return friends
            } catch (error: any) {
                console.error(error)
            }
        }
    }
})
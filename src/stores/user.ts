import { ref } from 'vue';
import { defineStore } from 'pinia';
import { PUT_DATA, GET_BY_PK_SK, LIST_BY_PK_SK, GET_BY_USERNAME, LIST_SELLING_BY_PK } from '@/components/tools/ddbActions';

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
        async fetchUser(PK: string, SK: string, inputUser?: any) {
            try {
                const retrievedUser = await GET_BY_PK_SK(PK, SK)
                if (!retrievedUser) {
                    if (inputUser.value) {
                        const newUser = await PUT_DATA({
                            PK: PK,
                            SK: '#METADATA',
                            email: inputUser.value.email,
                            username: inputUser.value.name,
                            avatar: inputUser.value.image,
                            bio: "Hi, I'm new! Nice to meet you!",
                            createdAt: new Date().toISOString(),
                            credits: 0,
                            itemsRemaining: 3,
                            petsRemaining: 3,
                            type: 'Metadata',
                            updatedAt: new Date().toISOString(),
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
                    return retrievedUser
                }
            } catch (error: any) {
                console.error("An error occurred in fetchUser: ", error)
            }
        },

        async fetchPets(PK: string) {
            const pets = await LIST_BY_PK_SK(PK, "PET#")
            try {
                console.log(pets)
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
            const trades = await LIST_BY_PK_SK(this.getUser.PK, "TRADE#")
            try {
                console.log(trades)
                this.trades = trades || []
                return this.trades
            } catch (error: any) {
                console.error(error)
            }
        },

        async fetchInventory() {
            const inventory = await LIST_BY_PK_SK(this.getUser.PK, "ITEM")
            try {
                console.log("The inventory from user.ts:", inventory)
                this.inventory = inventory || []
                return this.inventory
            } catch (error: any) {
                console.error("Error fetching the inventory: ", error)
                return this.inventory
            }
        },

        async fetchNotifications() {
            const notifications = await LIST_BY_PK_SK(this.getUser.PK, "NOTIFICATION")
            try {
                console.log("The notifications from user.ts:", notifications)
                this.notifications = notifications || []
                return this.notifications
            } catch (error: any) {
                console.error("Error fetching the notifications: ", error)
                return this.notifications
            }
        },

        async fetchShop(shopkeeperUsername: string) {
            const shopkeeper = await GET_BY_USERNAME(shopkeeperUsername, "#METADATA")
            const inventory = await LIST_SELLING_BY_PK(shopkeeper?.PK)
            try {
                console.log("The shop's inventory from user.ts:", inventory)
                return inventory || []
            } catch (error: any) {
                console.error("Error fetching the shop's inventory: ", error)
                return []
            }
        },

        async fetchFriends(PK: string) {
            const friends = await LIST_BY_PK_SK(PK, "RELATIONSHIP#")
            try {
                console.log(friends)
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
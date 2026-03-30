import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import { userStore } from './stores/user'
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import { createAuth0, useAuth0 } from '@auth0/auth0-vue'
import { GET_BY_PK_SK } from './components/tools/ddbActions'

const pinia = createPinia()
const app = createApp(App)
const vuetify = createVuetify({})
const auth0 = createAuth0({
    domain: import.meta.env.VITE_AUTH0_DOMAIN,
    clientId: import.meta.env.VITE_AUTH0_CLIENT_ID,
    authorizationParams: {
        redirect_uri: import.meta.env.VITE_AUTH0_CALLBACK_URL
    }
})

app.use(router)
app.use(pinia)
app.use(auth0)
app.use(vuetify)
app.mount('#app')

const uStore = userStore();

router.beforeEach(async (to) => {
    const { isAuthenticated, user } = useAuth0()
    if (isAuthenticated) {
        if (!uStore.getUser) {
            console.log("There is no user in the store data.")
            await uStore.fetchUser(user.value?.sub as string, "#METADATA#", user)
                .then(() => {
                    console.log("Got the logged in uStore's Metadata in main.ts: ", uStore.getUser);
                })
        } else {
            console.log("There is a user in the store data.")
        }
        switch (to.name) {
            case "trades":
                // await uStore.fetchFriends(auth.getUserId as string)
                await uStore.fetchTrades()
                return
            case "inventory":
                if (!uStore.getShop) {
                    await uStore.fetchShop(uStore.getUser?.id as string)
                }
                await uStore.fetchInventory()
                return
            case "shop":
                if (!uStore.getShop) {
                    await uStore.fetchShop(uStore.getUser?.id as string)
                }
                await uStore.fetchCredit()
                return
            case "profile":
                if (!uStore.getShop) {
                    await uStore.fetchShop(uStore.getUser?.id as string)
                }
                await uStore.fetchCredit()
                if (!uStore.getPets) {
                    await uStore.fetchPets()
                }
                if (!uStore.getFriends) {
                    // await uStore.fetchFriends(auth.getUserId as string)
                }
                return
            case "pets":
                if (!uStore.getPets) {
                    await uStore.fetchPets()
                }
                if (!uStore.getInventory) {
                    await uStore.fetchInventory()
                }
                // Get friends for trading
                // await uStore.fetchFriends(auth.getUserId as string)
                return
            default:
                console.log("Default switch")
                // Return the page (no extra prep is required)
                return
        }
    } else {
        console.log("Auth not found.")
        if (["login", "about", "home"].includes(to.name as string)) {
            return
        } else {
            return { name: 'login' }
        }
    }
}
)
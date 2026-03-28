import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import { userStore } from './stores/user'
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import { authStore } from './stores/auth'
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


const auth = authStore();
const user = userStore();

router.beforeEach(async (to) => {
    const { isAuthenticated } = useAuth0()
    if (isAuthenticated) {
        const test = await GET_BY_PK_SK("user000", "#METADATA#")
        console.log(test)
        console.log("Auth successful")
        switch (to.name) {
            case "trades":
                await user.fetchFriends(auth.getUserId as string)
                await user.fetchTrades()
                return
            case "inventory":
                if (!user.getShop) {
                    await user.fetchShop(user.getUser?.id as string)
                }
                await user.fetchInventory()
                return
            case "shop":
                if (!user.getShop) {
                    await user.fetchShop(user.getUser?.id as string)
                }
                await user.fetchCredit()
                return
            case "profile":
                if (!user.getShop) {
                    await user.fetchShop(user.getUser?.id as string)
                }
                await user.fetchCredit()
                if (!user.getPets) {
                    await user.fetchPets()
                }
                if (!user.getFriends) {
                    await user.fetchFriends(auth.getUserId as string)
                }
                return
            case "pets":
                if (!user.getPets) {
                    await user.fetchPets()
                }
                if (!user.getInventory) {
                    await user.fetchInventory()
                }
                // Get friends for trading
                await user.fetchFriends(auth.getUserId as string)
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
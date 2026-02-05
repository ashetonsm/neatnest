import './assets/main.css'

import { Amplify } from 'aws-amplify'
import outputs from '../amplify_outputs.json'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import { userStore } from './stores/user'
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import { authStore } from './stores/auth'

Amplify.configure(outputs)
const pinia = createPinia()
const app = createApp(App)
const vuetify = createVuetify({})

app.use(router)
app.use(pinia)
app.use(vuetify)
app.mount('#app')

const auth = authStore();
const user = userStore();

router.beforeEach(async (to) => {
    var authenticated = false;
    // There is no auth. Check once.
    if (!auth.getAuth) {
        console.log("Checking auth")
        authenticated = await auth.checkAuth()
    } else {
        authenticated = true;
    }
    if (authenticated) {
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
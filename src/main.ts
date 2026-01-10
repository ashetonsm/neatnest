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
const store = userStore();

router.beforeEach(async (to) => {
    // Check for auth once
    if (auth.getUserId == null && ["login", "about", "home"].includes(to.name as string)) {
        console.log("no auth required")
        return
    } else {
        console.log("auth required")
        const authenticated = await auth.checkAuth()
        if (authenticated) {
            switch (to.name) {
                case "inventory":
                    await store.fetchInventory()
                    return
                case "store":
                    await store.fetchCredit()
                    return
                case "profile":
                    if (!store.getPets) {
                        await store.fetchPets()
                    } 
                    if (!store.getFriends) {
                        await store.fetchFriends(auth.getUserId as string)
                    } 
                    return
                case "pets":
                    if (!store.getPets) {
                        await store.fetchPets()
                    }
                    if (!store.getInventory) {
                        await store.fetchInventory()
                    }
                    return
                default:
                    console.log("Default switch")
                    // Return the page (no extra prep is required)
                    return
            }
        }
    }
}
)
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
    // Check for auth once
    if (!auth.getAuth && ["login", "about", "home"].includes(to.name as string)) {
        console.log("no auth required")
        return
    } else {
        var authenticated = false;
        console.log("auth required")
        if (auth.getAuth) {
            console.log("Already authenticated")
            authenticated = true;
        } else {
            console.log("Checking auth")
            authenticated = await auth.checkAuth()
        }
        if (authenticated) {
            console.log("Auth successful")
            switch (to.name) {
                case "inventory":
                    await user.fetchInventory()
                    return
                case "shop":
                    await user.fetchCredit()
                    return
                case "profile":
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
                    return
                default:
                    console.log("Default switch")
                    // Return the page (no extra prep is required)
                    return
            }
        } else {
            console.log("Auth not found.")
            return {name: 'login'}
        }
    }
}
)
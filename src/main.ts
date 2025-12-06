import './assets/main.css'

import { Amplify } from 'aws-amplify'
import outputs from '../amplify_outputs.json'
import { createApp, inject } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import { userStore } from './stores/user'

Amplify.configure(outputs)
const pinia = createPinia()
const app = createApp(App)

app.use(router)
app.use(pinia)
app.mount('#app')

// router.ts or main.ts
router.beforeEach(async (to, from) => {
    const store = userStore()
    var user = store.getUser
    var pets = store.getPets
    var inventory = store.getInventory
    if (user == null) {
        await store.amplifyGetCurrentUser()
            .then(() => {
                user = store.getUser
                console.log("user: ", user)
            })

        if (pets == null) {
            pets = await store.fetchPets()
        }
        if (inventory == null) {
            inventory = await store.fetchInventory()
        }
    }
})
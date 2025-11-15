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
    if (user == null) {
        user = await store.amplifyGetCurrentUser()
    }
})
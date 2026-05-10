import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import { createAuth0, useAuth0 } from '@auth0/auth0-vue'
import { userStore } from './stores/user'

const pinia = createPinia()
const app = createApp(App)
const vuetify = createVuetify({
    theme: {
        defaultTheme: "system",
    }
})
const auth0 = createAuth0({
    domain: import.meta.env.VITE_AUTH0_DOMAIN,
    clientId: import.meta.env.VITE_AUTH0_CLIENT_ID,
    authorizationParams: {
        redirect_uri: import.meta.env.VITE_AUTH0_CALLBACK_URL
    }
})

app.use(auth0)
app.use(router)
app.use(pinia)
app.use(vuetify)
app.mount('#app')

const ustore = userStore()

router.beforeEach(async (to) => {
    if (!ustore.getUser) {
        const cookies = document.cookie.split(';');
        for (let cookie of cookies) {
            cookie = cookie.trim();
            if (cookie.startsWith('currentUser')) {
                ustore.fetchUser(cookie.split('=')[1], "#METADATA")
            }
        }
    }
}
)
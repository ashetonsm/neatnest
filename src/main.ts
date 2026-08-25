import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import { createAuth0 } from '@auth0/auth0-vue'
import createRouter from './router'

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

app
    .use(auth0)
    .use(createRouter(app))
    .use(pinia)
    .use(vuetify)

app.mount('#app')

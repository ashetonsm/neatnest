import './assets/main.css'

import { Amplify } from 'aws-amplify'
import outputs from '../amplify_outputs.json'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'

Amplify.configure(outputs)
const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')

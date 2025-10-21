import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index'

const app = createApp(App)

// ⬅️ aquí conectamos el router
app.use(router)

app.mount('#app')

// App
import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import { router } from './routes'
import './style.css'

// Bootstrap instalado
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'bootstrap/dist/js/bootstrap.bundle.min'
import { useUserStore } from './stores/user'

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
app.use(router)

const userStore = useUserStore()
userStore.loadUserFromLocalStorage()
app.mount('#app')
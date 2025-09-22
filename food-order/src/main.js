import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'

const app = createApp(App)

// create pinia instance so we can rehydrate stores on startup
const pinia = createPinia()
app.use(pinia)
app.use(router)
app.use(Toast, {
  timeout: 3000,
  closeOnClick: true,
  pauseOnHover: true,
  position: 'top-right',
})

// --- startup prefetch: if tokens exist, rehydrate auth and fetch user & locations ---
import { useAuthStore } from '@/stores/authStore'
import { useUserStore } from '@/stores/userStore'
import { useLocationStore } from '@/stores/locationStore'

try {
  const authStore = useAuthStore(pinia)
  const userStore = useUserStore(pinia)
  const locationStore = useLocationStore(pinia)

  const accessToken = localStorage.getItem('accessToken')
  const refreshToken = localStorage.getItem('refreshToken')
  if (accessToken) {
    // rehydrate minimal auth state so other code can rely on it
    authStore.accessToken = accessToken
    authStore.refreshToken = refreshToken

    // silently fetch current user and locations (don't block mount)
    userStore.fetchUser().catch((e) => {
      // ignore - UI will prompt login if needed
      console.debug('prefetch user failed', e)
    })

    locationStore.fetchLocationsByUser().catch((e) => {
      console.debug('prefetch locations failed', e)
    })
  }
} catch (e) {
  // noop in case stores cannot be instantiated here
  console.debug('startup prefetch skipped', e)
}

app.mount('#app')

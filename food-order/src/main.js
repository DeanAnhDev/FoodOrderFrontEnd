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

// Global scroll behavior
router.afterEach((to, from) => {
  // Scroll to top after route change with a small delay to ensure DOM is updated
  setTimeout(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, 100)
})

// Setup global cart refresh events
app.config.globalProperties.$refreshCart = () => {
  // This will be available in all components
  const cartStore = useCartStore(pinia)
  cartStore.fetchCart()
}

// Listen for custom cart refresh events
window.addEventListener('refreshCart', () => {
  const cartStore = useCartStore(pinia)
  cartStore.fetchCart()
})

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

  // Initialize auth state from localStorage
  authStore.initializeAuth()

  const accessToken = localStorage.getItem('accessToken')
  if (accessToken) {
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

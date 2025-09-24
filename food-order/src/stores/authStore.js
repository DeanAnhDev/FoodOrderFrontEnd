import { defineStore } from 'pinia'
import { loginUser, registerUser, logoutUser } from '@/services/authService'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    loading: false,
    error: null,
    message: '',
    accessToken: null,
    refreshToken: null,
  }),

  getters: {
    isAuthenticated: (state) => {
      return !!(state.accessToken || localStorage.getItem('accessToken'))
    },
  },

  actions: {
    // Initialize auth state from localStorage
    initializeAuth() {
      const accessToken = localStorage.getItem('accessToken')
      const refreshToken = localStorage.getItem('refreshToken')

      if (accessToken && refreshToken) {
        this.accessToken = accessToken
        this.refreshToken = refreshToken
      }
    },

    async login(loginData) {
      this.loading = true
      this.error = null
      this.message = ''
      try {
        const response = await loginUser(loginData)
        this.message = response.data.message
        this.accessToken = response.data.accessToken
        this.refreshToken = response.data.refreshToken

        localStorage.setItem('accessToken', this.accessToken)
        localStorage.setItem('refreshToken', this.refreshToken)
      } catch (err) {
        this.message = ''
        const msg = err.response?.data?.message || 'Đăng nhập thất bại!'
        this.error = msg
      } finally {
        this.loading = false
      }
    },

    async register(userData) {
      this.loading = true
      this.error = null
      try {
        const response = await registerUser(userData)
        this.message = response.data.message
      } catch (err) {
        this.error = err.response?.data?.message || 'Đăng ký thất bại!'
      } finally {
        this.loading = false
      }
    },

    async logout() {
      try {
        const accessToken = this.accessToken || localStorage.getItem('accessToken')
        const refreshToken = this.refreshToken || localStorage.getItem('refreshToken')

        if (accessToken && refreshToken) {
          await logoutUser({ accessToken, refreshToken }) // Gọi API logout
        }
      } catch (err) {
        console.warn('API logout thất bại, vẫn tiếp tục xóa local:', err)
      }

      // Dù API fail thì vẫn xóa token và reset store
      this.accessToken = null
      this.refreshToken = null
      this.message = ''
      this.error = null
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
    },
  },
})

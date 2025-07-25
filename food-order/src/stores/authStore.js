import { defineStore } from 'pinia'
import { loginUser, registerUser } from '@/services/authService'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    loading: false,
    error: null,
    message: '',
    accessToken: null,
    refreshToken: null,
  }),
  actions: {
    async login(loginData) {
      this.loading = true
      this.error = null
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

    logout() {
      this.accessToken = null
      this.refreshToken = null
      this.message = ''
      this.error = null
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
    },
  },
})


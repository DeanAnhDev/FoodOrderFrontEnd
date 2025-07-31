// 📁 src/stores/userStore.js
import { defineStore } from 'pinia'
import { getCurrentUser, updateUser } from '@/services/userService'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
    loading: false,
    error: null,
  }),

  actions: {
    async fetchUser() {
      this.loading = true
      this.error = null
      try {
        const res = await getCurrentUser()
        this.user = res.data
      } catch (err) {
        this.error = err.response?.data?.message || 'Lỗi không xác định!'
      } finally {
        this.loading = false
      }
    },

    async updateUserInfo(data) {
      try {
        const res = await updateUser(data)
        this.user = res.data || data
      } catch (err) {
        throw err
      }
    }
  }
})

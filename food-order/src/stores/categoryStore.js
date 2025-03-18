import { defineStore } from 'pinia'
import axios from 'axios'

export const useCategoryStore = defineStore('category', {
  state: () => ({
    categories: [],
    loading: false,
    error: null,
  }),
  actions: {
    async fetchCategories() {
      this.loading = true
      this.error = null
      try {
        const response = await axios.get('https://localhost:7289/api/FoodCategory')
        this.categories = response.data
      } catch (err) {
        this.error = 'Không thể tải danh mục!'
        console.error(err)
      } finally {
        this.loading = false
      }
    },
  },
})

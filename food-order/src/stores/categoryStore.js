import { defineStore } from 'pinia'
import { getCategories } from '@/services/categoryService'

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
        const response = await getCategories()
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

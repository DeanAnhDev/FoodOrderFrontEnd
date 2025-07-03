import { defineStore } from 'pinia'
import { getFoodBySlug } from '@/services/foodService'

export const useFoodBySlugStore = defineStore('foodBySlug', {
  state: () => ({
    food: [],
    loading: false,
    error: null,
  }),
  actions: {
    async fetchFoodBySlug(slug) {
      this.loading = true
      this.error = null
      try {
        const response = await getFoodBySlug(slug)
        console.log(response.data)
        this.food = response.data
      } catch (err) {
        this.error = 'Không thể tải món ăn!'
        console.error(err)
      } finally {
        this.loading = false
      }
    },
  },
})

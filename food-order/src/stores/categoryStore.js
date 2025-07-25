import { defineStore } from 'pinia'
import {
  getCategories,
  getCategoriesWithFoods,
  getListFoodByCategorySlug,
} from '@/services/categoryService'

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

export const useCategoriesWithFoodsStore = defineStore('categoriesWithFoods', {
  state: () => ({
    categoriesWithFoods: [],
    loading: false,
    error: null,
  }),
  actions: {
    async fetchCategoriesWithFoods() {
      this.loading = true
      this.error = null
      try {
        const response = await getCategoriesWithFoods()
        console.log(response.data)
        this.categoriesWithFoods = response.data
      } catch (err) {
        this.error = 'Không thể tải danh mục!'
        console.error(err)
      } finally {
        this.loading = false
      }
    },
  },
})
export const useFoodsByCategorySlugStore = defineStore('foodsByCategorySlug', {
  state: () => ({
    foodsByCategorySlug: null, // ✅ object chứa category, foods, combos
    loading: false,
    error: null,
  }),
  actions: {
    async fetchFoodsByCategorySlug(slug) {
      this.loading = true
      this.error = null
      try {
        const response = await getListFoodByCategorySlug(slug)
        this.foodsByCategorySlug = response.data // ✅ object với fields: foods, combos
      } catch (err) {
        this.error = 'Không thể tải danh mục!'
        console.error(err)
      } finally {
        this.loading = false
      }
    },
  },
})

import { defineStore } from 'pinia'
import {
  getCategories,
  getCategoriesWithFoods,
  getListFoodByCategorySlug,
  getListComboByCategorySlug,
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
    foodsByCategorySlug: [],
    loading: false,
    error: null,
  }),
  actions: {
    async fetchFoodsByCategorySlug(slug) {
      this.loading = true
      this.error = null
      try {
        const response = await getListFoodByCategorySlug(slug)
        this.foodsByCategorySlug = response.data
      } catch (err) {
        this.error = 'Không thể tải danh mục!'
        console.error(err)
      } finally {
        this.loading = false
      }
    },
  },
})

export const useCombosByCategorySlugStore = defineStore('combosByCategorySlug', {
  state: () => ({
    combosByCategorySlug: [],
    loading: false,
    error: null,
  }),
  actions: {
    async fetchCombosByCategorySlug(slug) {
      this.loading = true
      this.error = null
      try {
        const response = await getListComboByCategorySlug(slug)
        this.combosByCategorySlug = response.data
      } catch (err) {
        this.error = 'Không thể tải danh mục!'
        console.error(err)
      } finally {
        this.loading = false
      }
    },
  },
})


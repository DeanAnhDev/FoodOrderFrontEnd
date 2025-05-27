import axiosClient from '@/axiosClient'

export const getCategories = async () => {
  return axiosClient.get('/FoodCategory')
}

export const getCategoriesWithFoods = async () => {
  return axiosClient.get('/FoodCategory/with-foods')
}

export const getListFoodByCategorySlug = async (slug) => {
  return axiosClient.get(`/FoodCategory/foods-by-category/${slug}`)
}

export const getListComboByCategorySlug = async (slug) => {
  return axiosClient.get(`/FoodCategory/combos-by-category/${slug}`)
}
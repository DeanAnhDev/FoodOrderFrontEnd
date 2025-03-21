import axiosClient from '@/axiosClient'

export const getCategories = async () => {
  return axiosClient.get('/FoodCategory')
}

export const getCategoriesWithFoods = async () => {
  return axiosClient.get('/FoodCategory/with-foods')
}
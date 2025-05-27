import axiosClient from '@/axiosClient'

export const getFoodBySlug = async (slug) => {
  return axiosClient.get(`/Food/slug/${slug}`)
}

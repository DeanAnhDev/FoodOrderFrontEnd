import axiosClient from '@/axiosClient'

export const getFoods = async () => {
  return axiosClient.get('/Food')
}

import axiosClient from '@/axiosClient'

export const createOrder = async (data) => {
  return axiosClient.post('/order', data)
}

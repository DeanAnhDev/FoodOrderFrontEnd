import axiosClient from '@/axiosClient'

export const createOrder = async (data) => {
  return axiosClient.post('/order', data)
}

export const getOrders = async (query) => {
  return axiosClient.get('/order', { params: query })
}

export const updateOrderStatus = async (data) => {
  return axiosClient.put('/order/status', data)
}
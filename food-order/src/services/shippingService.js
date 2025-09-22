import axiosClient from '@/axiosClient'

export const estimateShippingFee = async (data) => {
  return axiosClient.post('/Ahamove/estimate-shipping-fee', data)
}

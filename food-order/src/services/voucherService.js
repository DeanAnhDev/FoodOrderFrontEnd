import axiosClient from '@/axiosClient'

// query là object { page, pageSize, code, isActive, ... }
export const getAllVouchers = async (query) => {
  return axiosClient.get('/voucher', { params: query })
}


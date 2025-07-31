// services/userService.ts
import axiosClient from '@/axiosClient'


export const getCurrentUser = () => {
  return axiosClient.get('/User')
}

export const updateUser = (data) => {
  return axiosClient.put('/User', data)
}
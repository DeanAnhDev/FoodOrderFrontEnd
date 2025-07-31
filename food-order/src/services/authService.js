import axiosClient from '@/axiosClient'

export const registerUser = async (userData) => {
  return axiosClient.post('/Auth/register', userData)
}

export const loginUser = async (loginData) => {
  return axiosClient.post('/Auth/login', loginData)
}

export const logoutUser = (data) => {
  return axiosClient.post('/Auth/logout', data)
}

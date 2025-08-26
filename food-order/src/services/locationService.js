import axiosClient from '@/axiosClient'

export const getLocationByUserId = async () => {
  return axiosClient.get(`/Location/userId`)
}

export const getLocationById = async (id) => {
  return axiosClient.get(`/Location/${id}`)
}

export const deleteLocation = async (id) => {
  return axiosClient.delete(`/Location/${id}`)
}

export const createLocation = async (data) => {
  return axiosClient.post(`/Location`, data)
}

export const updateLocation = async (data) => {
  return axiosClient.put(`/Location`, data)
}
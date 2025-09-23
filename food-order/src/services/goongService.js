import axios from '@/axiosClient'
import { GOONG_API_KEY } from '@/config'

// Gợi ý địa điểm theo từ khóa
export const suggestAddress = (query) => {
  return axios.get('https://rsapi.goong.io/Place/AutoComplete', {
    params: {
      api_key: GOONG_API_KEY,
      input: query,
    },
  })
}

// Lấy chi tiết (lat/lng) theo place_id
export const getPlaceDetail = (placeId) => {
  return axios.get('https://rsapi.goong.io/Place/Detail', {
    params: {
      api_key: GOONG_API_KEY,
      place_id: placeId,
    },
  })
}

export const checkLocation = async (data) => {
  return axios.post(`/Goong/inner-city`, data)
}

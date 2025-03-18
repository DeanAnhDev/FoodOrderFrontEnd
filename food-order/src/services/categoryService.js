import axios from 'axios'

export const getCategories = async () => {
  return axios.get('https://localhost:7289/api/FoodCategory')
}

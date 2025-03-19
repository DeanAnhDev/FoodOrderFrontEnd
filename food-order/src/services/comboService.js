import axios from 'axios'

export const getCombos = async () => {
  return axios.get('https://localhost:7289/api/Combo')
}


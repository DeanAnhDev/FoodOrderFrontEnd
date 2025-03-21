import axiosClient from '@/axiosClient';

export const getCombos = async () => {
  return axiosClient.get('/Combo');
}


import axiosClient from '@/axiosClient';

export const getCombos = async () => {
  return axiosClient.get('/Combo/combos');
}

export const getComboWithFoods = async (slug) => {
  return axiosClient.get(`/Combo/get-combo-with-food/slug/${slug}`);
}

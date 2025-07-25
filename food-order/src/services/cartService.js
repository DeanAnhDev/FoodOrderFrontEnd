// services/cartService.js
import axiosClient from '@/axiosClient'

export default {
  async getCart() {
    return await axiosClient.get('/cart')
  },
  async addItem({ foodId, comboId, quantity }) {
    return await axiosClient.post('/cart', { foodId, comboId, quantity })
  },
  async updateItem(cartItemId, quantity) {
    return await axiosClient.put(`/cart`, { cartItemId, quantity })
  },
  async removeItem(cartItemId) {
    return await axiosClient.delete(`/cart`, { data: { cartItemId } })
  },
}

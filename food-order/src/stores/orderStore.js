import { defineStore } from 'pinia'
import { createOrder } from '@/services/orderService'

export const useOrderStore = defineStore('order', {
  state: () => ({
    currentOrder: null,
    paymentUrl: null,
    loading: false,
    error: null,
    successMessage: null,
  }),

  actions: {
    async submitOrder(orderData) {
      this.loading = true
      this.error = null
      this.successMessage = null
      try {
        const res = await createOrder(orderData)

        if (res.data.success) {
          this.currentOrder = res.data.order
          this.paymentUrl = res.data.paymentUrl
          this.successMessage = res.data.message
        } else {
          this.error = res.data.message || 'Tạo đơn hàng thất bại'
        }

        return res.data
      } catch (err) {
        this.error = err.response?.data?.message || 'Có lỗi khi tạo đơn hàng'
        throw err
      } finally {
        this.loading = false
      }
    },
  },
})

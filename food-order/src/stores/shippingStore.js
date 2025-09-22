import { defineStore } from 'pinia'
import { estimateShippingFee } from '@/services/shippingService'

export const useShippingStore = defineStore('shipping', {
  state: () => ({
    fee: null,
    currency: null,
    formattedFee: null,
    loading: false,
    error: null,
  }),

  actions: {
    async getEstimateFee(requestData) {
      this.loading = true
      this.error = null
      try {
        const res = await estimateShippingFee(requestData)

        // backend trả về success, message, data
        this.fee = res.data.data.fee
        this.currency = res.data.data.currency
        this.formattedFee = res.data.data.formattedFee

        return res.data
      } catch (err) {
        this.error = err.response?.data?.message || 'Không thể tính phí giao hàng'
        throw err
      } finally {
        this.loading = false
      }
    },
  },
})

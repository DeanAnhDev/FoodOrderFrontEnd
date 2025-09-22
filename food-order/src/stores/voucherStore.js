import { defineStore } from 'pinia'
import { getAllVouchers } from '@/services/voucherService'

export const useVoucherStore = defineStore('voucher', {
  state: () => ({
    vouchers: [],
    total: 0,
    loading: false,
    error: null,
    query: {
      page: 1,
      pageSize: 10,
      code: null,
      isActive: true,
      type: null,
      startDateFrom: null,
      startDateTo: null,
      endDateFrom: null,
      endDateTo: null,
      isOutOfStock: null,
      minOrderAmount: null,
    },
  }),

  actions: {
    async fetchVouchers(customQuery = {}) {
      this.loading = true
      this.error = null
      try {
        // Luôn yêu cầu voucher đang hoạt động trên FE
        const params = { ...this.query, ...customQuery, isActive: true }
        const res = await getAllVouchers(params)
        // giả sử backend trả về { items, totalCount }
        this.vouchers = res.data.items || res.data
        this.total = res.data.totalCount || 0
      } catch (err) {
        this.error = err.response?.data?.message || 'Không thể tải danh sách voucher'
      } finally {
        this.loading = false
      }
    },

    setQuery(updates) {
      this.query = { ...this.query, ...updates }
    },
  },
})

import { defineStore } from 'pinia'
import { createOrder, getOrders } from '@/services/orderService'
import { useUserStore } from '@/stores/userStore'

export const useOrderStore = defineStore('order', {
  state: () => ({
    currentOrder: null,
    paymentUrl: null,
    orders: [],
    total: 0,
    loading: false,
    error: null,
    successMessage: null,
    query: {
      orderCode: null,
      userId: null,
      status: null,
      paymentStatus: null,
      page: 1,
      pageSize: 3,
      sortBy: 'CreatedAt',
      sortOrder: 'desc',
    },
  }),

  actions: {
    async fetchOrders(customQuery = {}) {
      this.loading = true
      this.error = null
      try {
        const userStore = useUserStore()

        // Đảm bảo user data được load trước
        if (!userStore.user) {
          await userStore.fetchUser()
        }

        let userId = null

        // Lấy userId từ JWT token trước (vì user object không có userId)
        const token = localStorage.getItem('accessToken')
        if (token) {
          try {
            const payload = JSON.parse(atob(token.split('.')[1]))
            // Lấy userId từ .NET Core JWT claim
            userId =
              payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] ||
              payload.id ||
              payload.userId ||
              payload.sub ||
              payload.nameid ||
              payload.unique_name
            console.log('JWT payload:', payload)
          } catch (e) {
            console.error('Cannot parse token:', e)
          }
        }

        // Fallback: thử lấy từ user object (mặc dù có thể không có)
        if (!userId) {
          userId =
            userStore.user?.id ||
            userStore.user?.userId ||
            userStore.user?.ID ||
            userStore.user?.UserId
        }

        // Debug log
        console.log('Current user:', userStore.user)
        console.log('UserId for orders:', userId)

        // Kiểm tra nếu vẫn không có userId
        if (!userId) {
          this.error = 'Không thể xác định thông tin người dùng'
          return
        }

        // Tự động thêm userId vào query
        const queryWithUserId = {
          ...this.query,
          ...customQuery,
          userId: userId,
        }

        console.log('Query sent to API:', queryWithUserId)

        const res = await getOrders(queryWithUserId)
        // backend trả về { orders, totalCount, currentPage, pageSize, totalPages, hasPreviousPage, hasNextPage }
        this.orders = res.data.orders || []
        this.total = res.data.totalCount || 0
      } catch (err) {
        this.error = err.response?.data?.message || 'Không thể tải danh sách đơn hàng'
      } finally {
        this.loading = false
      }
    },
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

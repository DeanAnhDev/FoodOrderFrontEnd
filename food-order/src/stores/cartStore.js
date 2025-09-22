// stores/cart.js
import { defineStore } from 'pinia'
import cartService from '@/services/cartService'
import { ref } from 'vue'

export const useCartStore = defineStore('cart', () => {
  const items = ref([])
  const subtotal = ref(0)
  const totalQuantity = ref(0)
  const cartId = ref(null)
  const loading = ref(false)
  const error = ref(null)

  const fetchCart = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await cartService.getCart()
      const cart = response.data.cart || {}
      items.value = cart.cartItems || []
      cartId.value = cart.id || cart.cartId || null
      subtotal.value = response.data.subtotal
      totalQuantity.value = response.data.totalQuantity
    } catch (err) {
      error.value = err.response?.data?.message || 'Lỗi khi tải giỏ hàng'
    } finally {
      loading.value = false
    }
  }

  const addToCart = async ({ foodId = null, comboId = null, quantity = 1 }) => {
    try {
      await cartService.addItem({ foodId, comboId, quantity })
      await fetchCart()
    } catch (err) {
      error.value = err.response?.data?.message || 'Lỗi khi thêm vào giỏ hàng'
    }
  }

  const updateQuantity = async (cartItemId, quantity) => {
    try {
      await cartService.updateItem(cartItemId, quantity)
      await fetchCart()
    } catch (err) {
      error.value = err.response?.data?.message || 'Lỗi khi cập nhật giỏ hàng'
      await fetchCart()
    }
  }

  const removeFromCart = async (cartItemId) => {
    try {
      await cartService.removeItem(cartItemId)
      await fetchCart()
    } catch (err) {
      error.value = err.response?.data?.message || 'Lỗi khi xóa món khỏi giỏ'
      await fetchCart()
    }
  }

  const clearCart = () => {
    items.value = []
    subtotal.value = 0
    totalQuantity.value = 0
    cartId.value = null
    error.value = null
  }

  return {
    items,
    subtotal,
    totalQuantity,
    cartId,
    loading,
    error,
    fetchCart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
  }
})

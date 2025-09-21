<template>
  <div class="order-summary">
    <h2>Tóm tắt đơn hàng</h2>
    <div v-if="items.length === 0" class="empty-summary">
      <p>Không có sản phẩm nào trong đơn hàng.</p>
    </div>
    <div v-else>
      <ul>
        <li v-for="item in items" :key="item.cartItemId" class="order-item">
          <span>{{ item.food?.foodName || item.combo?.comboName }}</span>
          <span>x {{ item.quantity }}</span>
          <span>{{ formatPrice(getDiscountedUnitPrice(item) * item.quantity) }}</span>
        </li>
      </ul>
      <div class="total">
        <span>Tổng cộng:</span>
        <span>{{ formatPrice(total) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useCartStore } from '@/stores/cartStore'
import { formattedPrice } from '@/utils/formart'

const cartStore = useCartStore()
const items = computed(() => cartStore.items)

const formatPrice = formattedPrice

const getDiscountedUnitPrice = (item) => {
  const base = item.food?.price || item.combo?.price || 0
  const promo = item.food?.promotion || item.combo?.promotion
  if (!promo || !promo.isActive) return base

  if (promo.type === 'Amount') {
    return Math.max(0, base - (promo.discountAmount || 0))
  }

  if (promo.type === 'Percent') {
    return Math.max(0, base - (base * (promo.discountAmount || 0)) / 100)
  }

  return base
}

const total = computed(() =>
  items.value.reduce((sum, item) => {
    return sum + getDiscountedUnitPrice(item) * item.quantity
  }, 0)
)
</script>

<style scoped>
.order-summary {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.order-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.total {
  font-weight: bold;
  margin-top: 20px;
}
</style>
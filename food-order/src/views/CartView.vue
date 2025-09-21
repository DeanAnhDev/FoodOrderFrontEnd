<script setup>
import { useCartStore } from '@/stores/cartStore'
import { computed, onMounted, ref } from 'vue'
import cartService from '@/services/cartService'
import { formattedPrice } from '@/utils/formart'
const cartStore = useCartStore()
// coupon/discount removed — payment uses only item-level promotions

onMounted(() => {
  cartStore.fetchCart()
})

const items = computed(() => cartStore.items)

const getImage = (item) =>
  item.food?.images?.thumbnailUrl || item.combo?.images?.thumbnailUrl || '/placeholder.jpg'

const getName = (item) =>
  item.food?.foodName || item.combo?.comboName || 'Không rõ'

// Base unit price (before any promotion)
const getPrice = (item) => item.food?.price || item.combo?.price || 0

// Calculate promotion amount (per unit) for an item. Supports two types seen in API:
// - promotion.type === 'Amount' => fixed amount off
// - promotion.type === 'Percent' => percent off (discountAmount interpreted as percent)
const getPromotionAmountPerUnit = (item) => {
  const promo = item.food?.promotion || item.combo?.promotion
  if (!promo || !promo.isActive) return 0

  const base = getPrice(item)
  if (promo.type === 'Amount') {
    // fixed money amount
    return Math.min(promo.discountAmount || 0, base)
  }

  if (promo.type === 'Percent') {
    const pct = promo.discountAmount || 0
    return (base * pct) / 100
  }

  return 0
}

// Unit price after applying item-level promotion
const getDiscountedUnitPrice = (item) => {
  const base = getPrice(item)
  const promo = getPromotionAmountPerUnit(item)
  return Math.max(0, base - promo)
}

const formatPrice = formattedPrice

const increase = (item) => {
  item.quantity++
  cartStore.updateQuantity(item.cartItemId, item.quantity)
}

const decrease = (item) => {
  if (item.quantity > 1) {
    item.quantity--
    cartStore.updateQuantity(item.cartItemId, item.quantity)
  }
}

const removeItem = (item) => {
  cartStore.removeFromCart(item.cartItemId)
}

// Total considers item-level promotions (discounted unit price * quantity)
const total = computed(() =>
  items.value.reduce((sum, item) => {
    const unit = getDiscountedUnitPrice(item)
    return sum + unit * item.quantity
  }, 0)
)

// Final total (no coupon) — already includes item-level promotions
const finalTotal = computed(() => total.value)

// track which items have details expanded (store cartItemId)
const expandedItems = ref(new Set())

const toggleDetails = (cartItemId) => {
  const s = expandedItems.value
  if (s.has(cartItemId)) s.delete(cartItemId)
  else s.add(cartItemId)
  // reassign to trigger reactivity
  expandedItems.value = new Set(s)
}
</script>


<template>
  <div class="cart-container">

    <div class="cart-layout">
      <!-- Giỏ hàng bên trái -->
      <div class="cart-items-section">
        <!-- Empty Cart State -->
        <div v-if="items.length === 0" class="empty-cart">
          <div class="empty-cart-icon">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.7 15.3C4.3 15.7 4.6 16.5 5.1 16.5H17M17 13V16.5M9 19.5C9.8 19.5 10.5 20.2 10.5 21S9.8 22.5 9 22.5 7.5 21.8 7.5 21 8.2 19.5 9 19.5ZM20 19.5C20.8 19.5 21.5 20.2 21.5 21S20.8 22.5 20 22.5 18.5 21.8 18.5 21 19.2 19.5 20 19.5Z"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </div>
          <h3>Giỏ hàng trống</h3>
          <p>Hãy thêm một số món ăn ngon vào giỏ hàng của bạn!</p>
          <router-link to="/menu" class="btn-primary">Xem thực đơn</router-link>
        </div>

        <!-- Cart Items -->
        <div v-else class="cart-items">
          <div v-for="item in items" :key="item.cartItemId" class="cart-item">
            <div class="item-image">
              <img :src="getImage(item)" :alt="getName(item)" />
              <div class="image-overlay">
                <button @click="removeItem(item)" class="remove-btn" title="Xóa khỏi giỏ hàng">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                      stroke-linejoin="round" />
                  </svg>
                </button>
              </div>
            </div>

            <div class="item-details">
              <h3 class="item-name">{{ getName(item) }}</h3>
              <div class="item-actions mt-3 flex items-center gap-3">
                <button @click="toggleDetails(item.cartItemId)" :aria-expanded="expandedItems.has(item.cartItemId)"
                  :class="['detail-toggle', expandedItems.has(item.cartItemId) ? 'open' : '']"
                  class="inline-flex items-center gap-2 text-indigo-600 text-sm focus:outline-none"
                  :title="expandedItems.has(item.cartItemId) ? 'Thu gọn' : 'Xem chi tiết'">
                  <svg class="chev" width="16" height="16" viewBox="0 0 24 24" fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                      stroke-linejoin="round" />
                  </svg>
                  <span class="underline-text">{{ expandedItems.has(item.cartItemId) ? 'Ẩn chi tiết' : 'Xem chi tiết'
                  }}</span>
                </button>


              </div>

              <transition name="detail-collapse">
                <div v-show="expandedItems.has(item.cartItemId)" class="detail-card w-full mt-3">
                  <div class="detail-card-inner">
                    <p class="mb-0 text-gray-700">{{ item.food?.description || item.combo?.description || 'Không có môtả' }}</p>
                  </div>
                </div>
              </transition>
              <div>
                <template v-if="getPromotionAmountPerUnit(item) > 0">
                  <div class="flex items-center gap-3">
                    <div class="text-sm text-gray-400 line-through">{{ formatPrice(getPrice(item)) }}</div>
                    <div class="text-sm text-green-600 font-semibold">-{{ formatPrice(getPromotionAmountPerUnit(item))
                    }}</div>
                  </div>
                  <div class="item-price">{{ formatPrice(getDiscountedUnitPrice(item)) }}</div>
                </template>
                <template v-else>
                  <div class="item-price">{{ formatPrice(getPrice(item)) }}</div>
                </template>
              </div>
            </div>

            <div class="item-controls">
              <div class="quantity-controls">
                <button @click="decrease(item)" class="quantity-btn" :disabled="item.quantity <= 1">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                      stroke-linejoin="round" />
                  </svg>
                </button>
                <span class="quantity">{{ item.quantity }}</span>
                <button @click="increase(item)" class="quantity-btn">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                      stroke-linejoin="round" />
                  </svg>
                </button>
              </div>
              <div class="item-total">{{ formatPrice(getDiscountedUnitPrice(item) * item.quantity) }}</div>
            </div>


          </div>
        </div>
      </div>

      <!-- Tổng tiền bên phải -->
      <div class="cart-summary" v-if="items.length > 0">
        <div class="summary-header">
          <h3>Tóm tắt đơn hàng</h3>
        </div>

        <!-- Coupon removed: payments use only item-level promotions -->

        <!-- Price Breakdown -->
        <div class="price-breakdown">
          <div class="price-row">
            <span>Tạm tính ({{ items.length }} món)</span>
            <span>{{ formatPrice(total) }}</span>
          </div>

          <div class="price-row total">
            <span>Tổng thanh toán</span>
            <span>{{ formatPrice(finalTotal) }}</span>
          </div>
        </div>

        <button class="checkout-btn">
          <span>Thanh toán</span>
          <span>{{ formatPrice(finalTotal) }}</span>
        </button>

        <!-- Security Badge -->
        <div class="security-badge">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z" stroke="currentColor" stroke-width="2"
              stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <span>Thanh toán an toàn và bảo mật</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cart-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: calc(100vh - 140px);
}

.cart-header {
  margin-bottom: 32px;
  padding: 24px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.cart-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.cart-title {
  font-size: 28px;
  font-weight: 700;
  color: #1a202c;
  margin: 0;
}

.item-count {
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
}

.cart-layout {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 32px;
}

@media (max-width: 1024px) {
  .cart-layout {
    grid-template-columns: 1fr;
    gap: 24px;
  }
}

/* Empty Cart */
.empty-cart {
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.empty-cart-icon {
  color: #cbd5e0;
  margin-bottom: 24px;
}

.empty-cart h3 {
  font-size: 24px;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 12px;
}

.empty-cart p {
  color: #718096;
  margin-bottom: 32px;
  font-size: 16px;
}

.btn-primary {
  display: inline-block;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 12px 24px;
  border-radius: 25px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
}

/* Cart Items */
.cart-items {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.cart-item {
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  display: grid;
  grid-template-columns: 120px 1fr auto;
  gap: 20px;
  align-items: center;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.cart-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
}

.cart-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

.item-image {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  width: 120px;
  height: 120px;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.cart-item:hover .item-image img {
  transform: scale(1.05);
}

.image-overlay {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.cart-item:hover .image-overlay {
  opacity: 1;
}

.remove-btn {
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #e53e3e;
  cursor: pointer;
  transition: all 0.2s ease;
}

.remove-btn:hover {
  background: white;
  transform: scale(1.1);
}

.item-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.item-name {
  font-size: 18px;
  font-weight: 600;
  color: #1a202c;
  margin: 0;
}

.item-description {
  color: #718096;
  font-size: 14px;
  margin: 0;
}

.item-price {
  font-size: 16px;
  font-weight: 600;
  color: #e53e3e;
}

.item-controls {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.quantity-controls {
  display: flex;
  align-items: center;
  background: #f7fafc;
  border-radius: 25px;
  padding: 4px;
  gap: 12px;
}

.quantity-btn {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 50%;
  background: white;
  color: #4a5568;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.quantity-btn:hover:not(:disabled) {
  background: #667eea;
  color: white;
  transform: scale(1.1);
}

.quantity-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.quantity {
  font-weight: 600;
  color: #2d3748;
  min-width: 20px;
  text-align: center;
}

.item-total {
  font-size: 18px;
  font-weight: 700;
  color: #1a202c;
}

/* Cart Summary */
.cart-summary {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  padding: 24px;
  height: fit-content;
  position: sticky;
  top: 100px;
}

.summary-header h3 {
  font-size: 20px;
  font-weight: 700;
  color: #1a202c;
  margin: 0 0 24px 0;
}

/* coupon styles removed */

.price-breakdown {
  margin-bottom: 24px;
}

.price-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  font-size: 14px;
}

.price-row.total {
  font-size: 18px;
  font-weight: 700;
  color: #1a202c;
}

.discount {
  color: #38a169;
  font-weight: 600;
}

.free {
  color: #38a169;
  font-weight: 600;
}

.divider {
  border: none;
  height: 1px;
  background: #e2e8f0;
  margin: 16px 0;
}

.checkout-btn {
  width: 100%;
  background: linear-gradient(135deg, #e53e3e 0%, #c53030 100%);
  color: white;
  border: none;
  padding: 16px 24px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.checkout-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(229, 62, 62, 0.4);
}

.security-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #718096;
  font-size: 12px;
  text-align: center;
}

@media (max-width: 768px) {
  .cart-container {
    padding: 16px;
  }

  .cart-header {
    padding: 16px;
  }

  .cart-title {
    font-size: 24px;
  }

  .cart-item {
    grid-template-columns: 80px 1fr;
    grid-template-rows: 1fr auto;
    gap: 12px;
  }

  .item-controls {
    grid-column: 1 / -1;
    flex-direction: row;
    justify-content: space-between;
  }

  .item-image {
    width: 80px;
    height: 80px;
  }
}

/* Details panel styling and animation */
.detail-toggle .chev {
  transition: transform 220ms ease;
  color: #0b0b0b;
}

.detail-toggle.open .chev {
  transform: rotate(180deg);
}

.detail-collapse-enter-from,
.detail-collapse-leave-to {
  max-height: 0;
  opacity: 0;
}

.detail-collapse-enter-to,
.detail-collapse-leave-from {
  max-height: 200px;
  opacity: 1;
}

.detail-collapse-enter-active,
.detail-collapse-leave-active {
  transition: max-height 260ms ease, opacity 220ms ease;
}

.detail-card {
  overflow: hidden;
}

.detail-card-inner {
  padding: 12px 16px;
  background: #f8fafc;
  border: 1px solid #e6edf3;
  border-radius: 8px;
}

.underline-text {
  text-decoration: underline;
 color: #0b0b0b;
}

.cursor-pointer {
  cursor: pointer;
}

/* Theme overrides: black / white / red */
.cart-container {
  background: #ffffff !important;
  color: #0b0b0b !important;
}

.cart-header {
  background: #ffffff !important;
  border-radius: 12px !important;
  box-shadow: 0 6px 30px rgba(0, 0, 0, 0.6) !important;
}

.cart-icon {
  background: linear-gradient(135deg, #b91c1c 0%, #ef4444 100%) !important;
}

.cart-title {
  color: #fff !important;
}

.item-count {
  background: #ef4444 !important;
  color: #fff !important;
}

.empty-cart {
  background: #ffffff !important;
  border-radius: 12px !important;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06) !important;
  border: 1px solid rgba(16, 24, 40, 0.04) !important;
}

.empty-cart h3 {
  color: #0b0b0b !important;
}

.empty-cart p {
  color: #6b7280 !important;
}

.btn-primary {
  background: linear-gradient(135deg, #ef4444 0%, #b91c1c 100%) !important;
}

.cart-item {
  background: #fff !important;
  border-radius: 12px !important;
  box-shadow: 0 8px 30px rgba(2, 6, 23, 0.25) !important;
}

.cart-item::before {
  background: linear-gradient(90deg, #ef4444 0%, #b91c1c 100%) !important;
}

.item-name {
  color: #0b0b0b !important;
}

.item-description {
  color: #6b7280 !important;
}

.item-price {
  color: #b91c1c !important;
}

.item-total {
  color: #0b0b0b !important;
}

.quantity-btn:hover:not(:disabled) {
  background: #ef4444 !important;
  color: #fff !important;
}

.cart-summary {
  background: #fff !important;
  box-shadow: 0 10px 30px rgba(2, 6, 23, 0.18) !important;
}

.summary-header h3 {
  color: #0b0b0b !important;
}

.price-row.total {
  color: #b91c1c !important;
}

.checkout-btn {
  background: linear-gradient(135deg, #ef4444 0%, #b91c1c 100%) !important;
}

.checkout-btn:hover {
  box-shadow: 0 10px 30px rgba(235, 64, 52, 0.35) !important;
}

.detail-card-inner {
  background: #fff !important;
  border: 1px solid rgba(185, 28, 28, 0.08) !important;
}
</style>
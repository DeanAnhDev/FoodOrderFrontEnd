<script setup>
import { useCartStore } from '@/stores/cartStore'
import { computed, onMounted, ref } from 'vue'
import cartService from '@/services/cartService'
import { formattedPrice } from '@/utils/formart'
const cartStore = useCartStore()
const coupon = ref('')
const couponError = ref(null)
const discount = ref(0) // % giảm giá nếu mã hợp lệ

onMounted(() => {
  cartStore.fetchCart()
})

const items = computed(() => cartStore.items)

const getImage = (item) =>
  item.food?.images?.thumbnailUrl || item.combo?.images?.thumbnailUrl || '/placeholder.jpg'

const getName = (item) =>
  item.food?.foodName || item.combo?.comboName || 'Không rõ'

const getPrice = (item) =>
  item.food?.price || item.combo?.price || 0

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

const total = computed(() =>
  items.value.reduce((sum, item) => {
    const price = getPrice(item)
    return sum + price * item.quantity
  }, 0)
)

const finalTotal = computed(() => {
  return total.value * (1 - discount.value / 100)
})

const applyCoupon = async () => {
  couponError.value = null
  discount.value = 0

  try {
    // Gọi API để kiểm tra mã giảm giá
    const response = await cartService.applyCoupon(coupon.value)

    if (response.data?.discountPercent) {
      discount.value = response.data.discountPercent
    } else {
      couponError.value = 'Mã không hợp lệ hoặc đã hết hạn'
    }
  } catch (err) {
    couponError.value = err.response?.data?.message || 'Lỗi áp dụng mã'
  }
}
</script>


<template>
  <div class="flex flex-col lg:flex-row gap-6">
    <!-- Giỏ hàng bên trái -->
    <div class="flex-1 space-y-6">
      <h1 class="text-2xl font-bold">GIỎ HÀNG CỦA TÔI</h1>
      <div v-for="item in items" :key="item.cartItemId"
        class="flex items-start gap-4 p-4 rounded-xl shadow-md bg-white">
        <img :src="getImage(item)" class="w-32 h-32 object-cover rounded-xl" alt="Ảnh món" />
        <div class="flex-1 space-y-2">
          <h2 class="text-lg font-semibold">
            {{ getName(item) }}
          </h2>
          <div class="text-sm text-gray-500">Xem chi tiết</div>
          <div class="flex gap-4 text-sm text-primary font-medium">
            <button class="underline text-red-500" @click="removeItem(item)">
              Xóa
            </button>

          </div>
        </div>
        <!-- Số lượng -->
        <div class="flex items-center gap-2">
          <button @click="decrease(item)" class="text-xl">−</button>
          <span class="font-semibold">{{ item.quantity }}</span>
          <button @click="increase(item)" class="text-xl">+</button>
        </div>
        <!-- Giá -->
        <div class="min-w-[80px] text-end font-semibold">
          {{ formatPrice(getPrice(item) * item.quantity) }}
        </div>
      </div>
    </div>

    <!-- Tổng tiền bên phải -->
    <div class="w-full lg:w-80 p-6 bg-white rounded-xl shadow-md space-y-4">
      <h3 class="font-bold text-lg">{{ items.length }} MÓN</h3>

      <div class="space-y-2">
        <label class="text-sm font-medium">Bạn có Mã giảm giá?</label>
        <input v-model="coupon" type="text" class="w-full border px-3 py-2 rounded-md" placeholder="Mã giảm giá *" />
        <button class="bg-black text-white px-4 py-2 rounded-md w-full" @click="applyCoupon">
          Áp dụng
        </button>
        <p v-if="couponError" class="text-red-500 text-sm">{{ couponError }}</p>
      </div>

      <div class="flex justify-between text-sm">
        <span>Tổng đơn hàng</span>
        <span>{{ formatPrice(total) }}</span>
      </div>

      <div class="flex justify-between font-bold text-base">
        <span>Tổng thanh toán</span>
        <span>{{ formatPrice(finalTotal) }}</span>
      </div>

      <button class="bg-red-600 text-white w-full py-3 rounded-full font-semibold text-lg">
        Thanh toán {{ formatPrice(finalTotal) }}
      </button>
    </div>
  </div>
</template>

<template>
  <section v-bind="$attrs">
    <div v-if="food" class="lg:grid lg:grid-cols-5 gap-6 px-4 py-4 lg:px-8 lg:py-10">
      <div class="flex justify-center col-span-3">
        <img v-if="food.images?.url" :src="food.images.url" alt="Hình ảnh món ăn"
          class="w-[70%] md:w-[50%] lg:w-[70%] lg:rounded-lg" />
      </div>

      <div class="h-[1px] bg-gray-400 -mx-6  mt-4 lg:hidden"></div>

      <div class="h-fit rounded-lg pt-4 relative lg:p-6 lg:px-8 lg:shadow-[0_0_10px_rgba(0,0,0,0.2)] col-span-2">
        <div class="absolute flex space-x-2 top-0 left-0 lg:left-8">
          <span class="w-3 h-7 bg-red-600 inline-block"></span>
          <span class="w-3 h-7 bg-red-600 inline-block"></span>
          <span class="w-3 h-7 bg-red-600 inline-block"></span>
        </div>

        <div class="flex flex-col justify-between mt-8 gap-2">
          <h2 class="text-2xl md:text-3xl font-bold items-center uppercase">{{ food.foodName }}</h2>
          <div class="flex items-center space-x-3">
            <span v-if="food?.promotion?.isActive" class="text-gray-400 line-through text-lg md:text-2xl">
              {{ formattedPrice(food.price) }}
            </span>
            <span v-if="food?.promotion?.isActive"
              class="bg-red-600 text-white text-xs md:text-sm px-2 py-1 rounded-md font-semibold mr-2">
              {{ food.promotion.type === 'Percentage' ? `${food.promotion.discountAmount}% GIẢM` :
                `${formattedPrice(food.promotion.discountAmount)} GIẢM` }}
            </span>
          </div>

          <span class="text-red-600 font-semibold text-2xl md:text-3xl">
            {{ formattedPrice(finalPrice) }}
          </span>

        </div>
        <p class="text-gray-700 my-4 font-semibold uppercase">Số lượng: {{ food.quantity }}</p>
        <p class="text-gray-700 my-4">{{ food.description }}</p>

        <!-- Wrapper cho mobile fixed -->
        <div
          class="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-[0_-2px_10px_rgba(0,0,0,0.1)]  md:static md:shadow-none lg:p-0">
          <div class="flex items-center justify-between gap-x-4 border-gray-300  lg:border-t lg:pt-4">
            <!-- Quantity Controls -->
            <div class="flex items-center gap-x-2">
              <!-- Minus Button -->
              <button @click="decrease" :disabled="quantity <= 1" class="w-9 h-9 flex items-center justify-center border border-gray-600 rounded-full text-gray-800 transition 
                 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                </svg>
              </button>

              <span class="text-lg font-semibold min-w-[20px] text-center">{{ quantity }}</span>


              <!-- Plus Button -->
              <button @click="increase" :disabled="food.quantity === 0 || quantity >= food.quantity" class="w-9 h-9 flex items-center justify-center border border-gray-600 rounded-full text-gray-800 
    transition cursor-pointer
    hover:bg-gray-100
    disabled:opacity-50 disabled:cursor-not-allowed">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>

            <!-- Add to Cart Button -->
            <div class="mt-3 flex justify-center">
              <button v-if="food.quantity > 0" @click="addToCart"
                class="w-full md:w-auto px-4 py-2 md:py-3 bg-red-600 text-white rounded-lg md:rounded-full font-semibold text-base hover:bg-red-700 transition duration-300 cursor-pointer text-center">
                Thêm vào giỏ hàng
              </button>

              <span v-else
                class="w-full md:w-auto px-4 py-2 md:py-3 bg-gray-400 text-white rounded-lg md:rounded-full font-semibold text-base text-center cursor-not-allowed">
                Hết hàng
              </span>
            </div>
          </div>
        </div>
      </div>


    </div>

    <div v-else class="text-center text-gray-500">Đang tải...</div>
  </section>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useFoodBySlugStore } from '@/stores/foodStore'
import { formattedPrice } from '@/utils/formart'
import { ref } from 'vue'
import { useCartStore } from '@/stores/cartStore'
import { useAuthStore } from '@/stores/authStore'
import { useToast } from 'vue-toastification'
import { useRouter } from 'vue-router'

const cartStore = useCartStore()
const authStore = useAuthStore()
const toast = useToast()
const router = useRouter()

const route = useRoute()
const foodBySlugStore = useFoodBySlugStore()

const food = computed(() => foodBySlugStore.food)

onMounted(() => {
  const foodSlug = route.params.foodSlug
  if (foodSlug) {
    foodBySlugStore.fetchFoodBySlug(foodSlug)
  }
})


const finalPrice = computed(() => {
  if (!food.value) return 0
  const promo = food.value.promotion
  if (promo?.isActive) {
    if (promo.type === 'Percentage') return food.value.price * (1 - promo.discountAmount / 100)
    if (promo.type === 'Amount') return food.value.price - promo.discountAmount
  }
  return food.value.price
})


const quantity = ref(1)

const increase = () => {
  if (quantity.value < food.value.quantity) {
    quantity.value++
  }
}



const decrease = () => {
  if (quantity.value > 1) quantity.value--
}


const addToCart = async () => {
  // Kiểm tra trạng thái đăng nhập
  if (!authStore.isAuthenticated) {
    toast.warning('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!')
    router.push('/login')
    return
  }

  if (!food.value?.foodId || quantity.value <= 0) {
    toast.error('Dữ liệu món ăn không hợp lệ.')
    return
  }

  try {
    await cartStore.addToCart({ foodId: food.value.foodId, quantity: quantity.value })
    toast.success('Đã thêm vào giỏ hàng!')
  } catch (error) {
    toast.error('Thêm vào giỏ hàng thất bại!')
  }
}

</script>

<template>
  <section v-bind="$attrs">
    <div v-if="food" class="lg:grid lg:grid-cols-5 gap-6 px-4 py-4 lg:px-8 lg:py-10">
      <div class="flex justify-center col-span-3">
        <img :src="`${IMG_BASE_URL}${food.image}`" alt="Hình ảnh món ăn"
          class="w-[70%] md:w-[50%] lg:w-[70%] lg:rounded-lg" />
      </div>

      <div class="h-[1px] bg-gray-400 -mx-6  mt-4 lg:hidden"></div>

      <div class="h-fit rounded-lg pt-4 relative lg:p-6 lg:px-8 lg:shadow-[0_0_10px_rgba(0,0,0,0.2)] col-span-2">
        <div class="absolute flex space-x-2 top-0 left-0 lg:left-8">
          <span class="w-3 h-7 bg-red-600 inline-block"></span>
          <span class="w-3 h-7 bg-red-600 inline-block"></span>
          <span class="w-3 h-7 bg-red-600 inline-block"></span>
        </div>

        <div class="flex justify-between mt-8 gap-2">
          <h2 class="text-2xl md:text-3xl font-bold items-center uppercase">{{ food.foodName }}</h2>
          <p class="text-2xl md:text-3xl font-semibold uppercase ">{{ formattedPrice(food.price) }}</p>
        </div>
        <p class="text-gray-700 mt-4">{{ food.description }}</p>
        <div class="h-[1px] bg-gray-400 -mx-6  mt-4 hidden md:block"></div>
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
              <button @click="increase" class="w-9 h-9 flex items-center justify-center border border-gray-600 rounded-full text-gray-800 
                 hover:bg-gray-100 transition cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
  
            <!-- Add to Cart Button -->
            <div class="flex-grow md:flex-grow-0">
              <button @click="addToCart(food)" class="w-full py-3 bg-red-600 text-white rounded-full font-semibold text-lg 
                 hover:bg-red-700 transition-colors duration-300 cursor-pointer md:w-auto md:px-6">
                Thêm vào giỏ hàng <i class="fas fa-shopping-cart ml-2"></i>
              </button>
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
import { IMG_BASE_URL } from '../../config'
import { useRoute } from 'vue-router'
import { useFoodBySlugStore } from '@/stores/foodStore'
import { formattedPrice } from '@/utils/formart'
import { ref } from 'vue'

const route = useRoute()
const foodBySlugStore = useFoodBySlugStore()

const food = computed(() => foodBySlugStore.food)

onMounted(() => {
  const foodSlug = route.params.foodSlug
  if (foodSlug) {
    foodBySlugStore.fetchFoodBySlug(foodSlug)
  }
})

const quantity = ref(1)

const increase = () => {
  quantity.value++
}

const decrease = () => {
  if (quantity.value > 1) quantity.value--
}

</script>

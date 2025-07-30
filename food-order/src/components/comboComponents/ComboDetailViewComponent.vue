<template>
  <section v-bind="$attrs">
    <div v-if="comboWithFoods" class="lg:grid lg:grid-cols-5 gap-6  py-4 lg:px-8 lg:py-10">
      <div class="flex justify-center col-span-3 items-start ">
        <div class="w-[70%] md:w-[50%] lg:w-[80%] aspect-[4/3]">
          <img v-if="comboWithFoods.images?.url" :src="`${comboWithFoods.images.url}`" alt="Hình ảnh combo"
            class="w-full h-full object-contain rounded-lg" />
        </div>
      </div>


      <div class="w-full h-[1px] bg-gray-300 mt-4 lg:hidden"></div>
      <div class="h-fit rounded-lg pt-4 relative lg:p-6 lg:px-6 lg:shadow-[0_0_10px_rgba(0,0,0,0.2)] col-span-2 ">
        <div class="absolute flex space-x-2 top-0 left-0 lg:left-8 left-4">
          <span class="w-3 h-7 bg-red-600 inline-block"></span>
          <span class="w-3 h-7 bg-red-600 inline-block"></span>
          <span class="w-3 h-7 bg-red-600 inline-block"></span>
        </div>

        <div class="flex justify-between mt-8 gap-2 px-4 lg:px-0">
          <h2 class="text-3xl md:text-3xl font-bold items-center uppercase">{{ comboWithFoods.comboName }}</h2>
          <p class="text-3xl md:text-3xl font-semibold uppercase ">{{ formattedPrice(comboWithFoods.price) }}</p>
        </div>
        <p class="text-gray-700 mt-4 px-4 lg:px-0 lg:pb-4 font-semibold uppercase ">Số lượng: {{ comboWithFoods.quantity
        }}</p>
        <p class="text-gray-700 mt-4 px-4 lg:px-0 lg:pb-4">{{ comboWithFoods.description }}</p>



        <div class="border-gray-200  lg:border-t  lg:pt-4">
          <div class="w-full h-[1px] bg-gray-200 mt-4 lg:hidden"></div>
          <h3 class="font-semibold text-xl px-4 lg:px-0 uppercase hidden lg:block">Combo bao gồm:</h3>
          <ul class="mb-6">
            <li v-for="detail in comboWithFoods.comboDetails">
              <div class="px-4 lg:px-0 flex my-5 gap-3">
                <img v-if="detail.food.images?.url" :src="`${detail.food.images.url}`" alt="Food image"
                  class="w-[100px] h-[100px]" />
                <div class=" flex flex-col justify-center text-xl ">
                  <strong>{{ detail.food.foodName }}</strong>
                  <p>({{ detail.quantity }} Phần)</p>
                </div>
              </div>
              <div class="w-full h-[1px] bg-gray-300 mt-4 lg:hidden"></div>
            </li>
          </ul>
        </div>

        <!-- Wrapper cho mobile fixed -->
        <div
          class="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-[0_-2px_10px_rgba(0,0,0,0.1)]  md:static md:shadow-none lg:p-0">
          <div class="flex items-center justify-between gap-x-4 border-gray-200 lg:border-t lg:pt-4">
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
              <button @click="increase" :disabled="comboWithFoods.quantity === 0 || quantity >= comboWithFoods.quantity" class="w-9 h-9 flex items-center justify-center border border-gray-600 rounded-full text-gray-800 
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
              <button v-if="comboWithFoods.quantity > 0" @click="addToCart"
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
import { formattedPrice } from '@/utils/formart'
import { ref } from 'vue'
import { useComboDetailWithFoodsStore } from '@/stores/comboStore'
import { useCartStore } from '@/stores/cartStore'
import { useToast } from 'vue-toastification'

const cartStore = useCartStore()
const toast = useToast()
const route = useRoute()

const comboWithFoodsBySlugStore = useComboDetailWithFoodsStore()

const comboWithFoods = computed(() => comboWithFoodsBySlugStore.comboWithFoods)

onMounted(() => {
  const comboSlug = route.params.comboSlug
  if (comboSlug) {
    comboWithFoodsBySlugStore.fetchComboWithFoods(comboSlug)

  }
})


const quantity = ref(1)

const increase = () => {
  if (quantity.value < comboWithFoods.value.quantity) {
    quantity.value++
  }
}



const decrease = () => {
  if (quantity.value > 1) quantity.value--
}



const addToCart = async () => {
  if (!comboWithFoods.value?.comboId || quantity.value <= 0) {
    toast.error('Dữ liệu món ăn không hợp lệ.')
    return
  }

  try {
    await cartStore.addToCart({ comboId: comboWithFoods.value.comboId, quantity: quantity.value })
    toast.success('Đã thêm vào giỏ hàng!')
  } catch (error) {
    toast.error('Thêm vào giỏ hàng thất bại!')
  }
}
</script>

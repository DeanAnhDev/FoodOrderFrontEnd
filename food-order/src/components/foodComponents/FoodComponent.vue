<template>
  <ul class="grid md:grid-cols-3 lg:grid-cols-4 gap-6 p-3">
    <li
      v-for="food in category.foods"
      :key="food.foodId"
      class="rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 bg-white flex flex-col h-full"
    >
      <div class="relative overflow-hidden rounded-t-lg aspect-[4/3]">
        <Info
          class="absolute top-2 right-2 h-7 w-7 bg-black/50 text-white rounded-full shadow-md z-10 cursor-pointer transition-all duration-300 hover:bg-black/70"
        />  

        <img
          :src="`${IMG_BASE_URL}${food.image}`"
          alt="Hình ảnh món ăn"
          class="absolute inset-0 w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>

      <div class="p-4 flex flex-col flex-grow">
        <div class="flex justify-between">
          <h2 class="text-xl text-primary font-semibold w-3/5 break-words cursor-pointer">
            {{ food.foodName }}
          </h2>
          <h2 class="text-xl text-primary font-bold w-2/5 text-right">
            {{ formattedPrice(food.price) }}
          </h2>
        </div>

        <p class="text-gray-600 text-sm mt-2 line-clamp-2 flex-grow">{{ food.description }}</p>

        <div class="mt-3 flex justify-center">
          <button
            @click="addToCart(food)"
            class="w-full py-3 bg-red-600 text-white rounded-full font-semibold text-base hover:bg-red-700 transition-colors duration-300 cursor-pointer"
          >
            Thêm vào giỏ hàng
          </button>
        </div>
      </div>
    </li>
  </ul>
</template>

<script setup>
import { IMG_BASE_URL } from '../../config'
import { Info } from 'lucide-vue-next'

defineProps({
  category: Object,
  formattedPrice: Function,
})

const emit = defineEmits(['add-to-cart'])

const addToCart = (food) => {
  emit('add-to-cart', food)
}
</script>

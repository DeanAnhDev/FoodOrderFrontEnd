<template>
  <section v-bind="$attrs">
    <div v-if="food" class="bg-white shadow-lg rounded-lg p-6">
      <img :src="`${IMG_BASE_URL}${food.image}`" alt="Hình ảnh món ăn" class="w-full rounded-lg" />
      <h1 class="text-3xl font-bold mt-4">{{ food.foodName }}</h1>
      <p class="text-xl text-red-600 font-semibold">{{ formattedPrice(food.price) }}</p>
      <p class="text-gray-700 mt-4">{{ food.description }}</p>

      <button
        @click="addToCart(food)"
        class="mt-6 w-full py-3 bg-red-600 text-white rounded-full font-semibold text-lg hover:bg-red-700 transition-colors duration-300 cursor-pointer"
      >
        Thêm vào giỏ hàng
      </button>
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
const route = useRoute()
const foodBySlugStore = useFoodBySlugStore()

const food = computed(() => foodBySlugStore.food)

onMounted(() => {
  const foodSlug = route.params.foodSlug
  if (foodSlug) {
    foodBySlugStore.fetchFoodBySlug(foodSlug)
  }
})

</script>

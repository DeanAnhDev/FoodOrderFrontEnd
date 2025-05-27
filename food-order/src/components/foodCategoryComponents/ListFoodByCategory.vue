<template>
  <ul v-if="foods.length" class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 p-3">
    <li v-for="food in foods" :key="food.foodId"
      class="rounded-lg shadow-md hover:shadow-xl bg-white flex flex-col transition duration-300">
      <div class="relative aspect-[4/3] overflow-hidden rounded-t-lg">
        <img :src="`${IMG_BASE_URL}${food.image}`" :alt="food.foodName"
          class="w-full h-full object-cover transition-transform duration-300 hover:scale-105 cursor-pointer"
          @click="goToDetail(food.slug)" />
      </div>
      <div class="p-4 flex flex-col flex-grow">
        <h2 class="text-primary font-semibold text-lg cursor-pointer" @click="goToDetail(food.slug)">
          {{ food.foodName }}
        </h2>
        <p class="text-gray-600 text-sm mt-2 line-clamp-2 flex-grow">
          {{ food.description }}
        </p>
        <div class="mt-3 font-bold text-right text-primary">
          {{ formattedPrice(food.price) }}
        </div>
      </div>
    </li>
  </ul>
  <p v-else class="text-center text-gray-500">Không có món ăn nào.</p>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { IMG_BASE_URL } from '@/config'
import { formattedPrice } from '@/utils/formart'

const props = defineProps({
  category: Object,
})


const router = useRouter()

const goToDetail = (slug) => {
  router.push({ name: 'FoodDetail', params: { foodSlug: slug } })
}

const foods = props.category.foods || [];

</script>

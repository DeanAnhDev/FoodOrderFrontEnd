<template>
  <section v-bind="$attrs" class="mb-10">
    <p v-if="foodCategoriesWithFoodsStore.loading" class="text-center text-gray-500">Đang tải...</p>

    <p v-else-if="foodCategoriesWithFoodsStore.error" class="text-center text-red-500">
      {{ foodCategoriesWithFoodsStore.error }}
    </p>

    <div
      v-else-if="categoriesWithFoods.length > 0"
      v-for="category in categoriesWithFoods"
      :key="category.id"
      class="mt-5"
    >
      <div class="flex items-center">
        <h1
          class="text-primary font-title-menu-mobile font-bold uppercase text-xl sm:text-3xl p-3 sm:p-5 relative"
        >
          {{ category.categoryName }}
        </h1>
        <div class="flex-grow h-0.5 bg-gray-300 mr-5"></div>
      </div>

      <p v-if="category.foods.length === 0" class="text-center text-gray-500">
        Không có món ăn nào.
      </p>

      <FoodComponent
        :category="category"
        :formattedPrice="formattedPrice"
        @add-to-cart="addToCart"
      />
    </div>

    <p v-else class="text-center text-gray-500">Không có danh mục nào để hiển thị.</p>
  </section>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useCategoriesWithFoodsStore } from '@/stores/categoryStore'
import FoodComponent from '@/components/foodComponents/FoodComponent.vue'

const foodCategoriesWithFoodsStore = useCategoriesWithFoodsStore()
const categoriesWithFoods = computed(() => foodCategoriesWithFoodsStore.categoriesWithFoods)

onMounted(async () => {
  await foodCategoriesWithFoodsStore.fetchCategoriesWithFoods()
})

const formattedPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(price)
}

const addToCart = (food) => {
  console.log('Món ăn được thêm:', food)
}
</script>

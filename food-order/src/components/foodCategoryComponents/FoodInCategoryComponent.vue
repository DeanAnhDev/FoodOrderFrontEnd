<template>
  <section class="mb-10">
    <!-- Hiển thị lỗi nếu có -->
    <p v-if="foodsByCategorySlugStore.error" class="text-center text-red-500">
      {{ foodsByCategorySlugStore.error }}
    </p>

    <!-- Hiển thị danh mục nếu có dữ liệu -->
    <div v-if="categoryData" class="mt-5">
      <div class="flex items-center">
        <h1 class="text-primary font-title-menu-mobile font-bold uppercase text-xl sm:text-3xl p-3 sm:p-5 relative">
          {{ categoryData.categoryName || 'Danh mục không xác định' }}
        </h1>
        <div class="flex-grow h-0.5 bg-gray-300 mr-5"></div>
      </div>
      <FoodComponent :category="categoryData" />
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useFoodsByCategorySlugStore } from '@/stores/categoryStore'
import { useRoute } from 'vue-router'
import FoodComponent from '@/components/foodComponents/FoodComponent.vue'

const route = useRoute()
const foodsByCategorySlugStore = useFoodsByCategorySlugStore()

// Lấy dữ liệu từ store (gồm cả foods + combos)
const categoryData = computed(() => {
  const data = foodsByCategorySlugStore.foodsByCategorySlug
  if (!data) return null

  const hasFoods = Array.isArray(data.foods) && data.foods.length > 0
  const hasCombos = Array.isArray(data.combos) && data.combos.length > 0

  return hasFoods || hasCombos ? data : null
})

onMounted(async () => {
  const categorySlug = route.params.categorySlug
  if (categorySlug) {
    await foodsByCategorySlugStore.fetchFoodsByCategorySlug(categorySlug)
  }
})
</script>

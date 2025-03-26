<template>
  <section class="mb-10">
    <p v-if="foodsByCategorySlugStore.loading" class="text-center text-gray-500">Đang tải...</p>

    <p v-else-if="foodsByCategorySlugStore.error" class="text-center text-red-500">
      {{ foodsByCategorySlugStore.error }}
    </p>

    <div v-else-if="foodsInCategory" class="mt-5">
      <div class="flex items-center">
        <h1
          class="text-primary font-title-menu-mobile font-bold uppercase text-xl sm:text-3xl p-3 sm:p-5 relative"
        >
          {{ foodsInCategory.categoryName || 'Danh mục không xác định' }}
        </h1>
        <div class="flex-grow h-0.5 bg-gray-300 mr-5"></div>
      </div>
      <FoodComponent :category="foodsInCategory" />
    </div>
    <p v-else class="text-center text-gray-500">Không có danh mục nào để hiển thị.</p>
  </section>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useFoodsByCategorySlugStore } from '@/stores/categoryStore'
import { useRoute } from 'vue-router'
import FoodComponent from '@/components/foodComponents/FoodComponent.vue'

const route = useRoute()
const foodsByCategorySlugStore = useFoodsByCategorySlugStore()

const foodsInCategory = computed(() => foodsByCategorySlugStore.foodsByCategorySlug)

onMounted(async () => {
  const categorySlug = route.params.categorySlug
  if (categorySlug) {
    await foodsByCategorySlugStore.fetchFoodsByCategorySlug(categorySlug)
  }
})
</script>

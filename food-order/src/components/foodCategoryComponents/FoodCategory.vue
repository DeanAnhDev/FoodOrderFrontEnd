<template>
  <section class="mt-5 flex items-center" v-bind="$attrs">
    <h1
      class="text-primary font-title-menu-mobile font-bold uppercase text-xl sm:text-3xl p-3 sm:p-5 relative"
    >
      Danh mục món ăn
    </h1>
    <div class="flex-grow h-0.5 bg-gray-300 mr-5"></div>
  </section>
  <section v-bind="$attrs" class="mb-10">
    <p v-if="categoryStore.loading" class="text-center text-gray-500">Đang tải...</p>

    <p v-if="categoryStore.error" class="text-center text-red-500">{{ categoryStore.error }}</p>

    <div
      v-if="categoryStore.categories.length"
      class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 m-2 gap-5"
    >
      <div
        v-for="category in categoryStore.categories"
        :key="category.id"
        class=" rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer"
      >
        <div class="relative overflow-hidden rounded-t-lg aspect-[4/3]">
          <img
            :src="`${IMG_BASE_URL}${category.imageUrl}`"
            alt="Hình ảnh món ăn"
            class="absolute inset-0 w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
        <p
          class="font-title font-[600] text-left p-3 text-xl flex items-center hover:text-title-hover"
        >
          {{ category.categoryName }} <ChevronRight class="w-5 h-5 stroke-[3] text-current" />
        </p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { onMounted } from 'vue'
import { useCategoryStore } from '@/stores/categoryStore'
import { ChevronRight } from 'lucide-vue-next'
import { IMG_BASE_URL } from '../../config'


const categoryStore = useCategoryStore()

onMounted(() => {
  categoryStore.fetchCategories()
})
</script>

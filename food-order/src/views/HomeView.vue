<template class="flex flex-col">
  <section>
    <Slider />
  </section>
  <section>
    <FoodCategoy class="max-w-6xl w-full mx-auto" />
  </section>
</template>

<script setup>
import Slider from '@/components/homeComponents/Slider.vue'
import FoodCategoy from '@/components/foodCategoryComponents/FoodCategory.vue'
</script>

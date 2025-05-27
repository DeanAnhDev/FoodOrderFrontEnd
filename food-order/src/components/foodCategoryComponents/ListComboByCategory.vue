<template>
  <ul
    v-if="combos"
    class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 p-3"
  >
    <li
      v-for="combo in combos"
      :key="combo.comboId"
      class="rounded-lg shadow-md hover:shadow-xl bg-white flex flex-col transition duration-300"
    >
      <div class="relative aspect-[4/3] overflow-hidden rounded-t-lg">
        <img
          :src="`${IMG_BASE_URL}${combo.image}`"
          :alt="combo.comboName"
          class="w-full h-full object-cover transition-transform duration-300 hover:scale-105 cursor-pointer"
          @click="goToDetail(combo.slug)"
        />
      </div>
      <div class="p-4 flex flex-col flex-grow">
        <h2
          class="text-primary font-semibold text-lg cursor-pointer"
          @click="goToDetail(combo.slug)"
        >
          {{ combo.comboName }}
        </h2>
        <p class="text-gray-600 text-sm mt-2 line-clamp-2 flex-grow">
          {{ combo.description }}
        </p>
        <div class="mt-3 font-bold text-right text-primary">
          {{ formattedPrice(combo.price) }}
        </div>
      </div>
    </li>
  </ul>
  <p v-else class="text-center text-gray-500">Không có combo nào.</p>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { IMG_BASE_URL } from '@/config'
import { formattedPrice } from '@/utils/formart'

const props = defineProps({
  category: {
    type: Object,
    default: () => [],
  },

})

const router = useRouter()

const goToDetail = (slug) => {
  router.push({ name: 'ComboDetail', params: { comboSlug: slug } })
}

const combos = props.category

</script>

<template>
  <section class="mt-5 flex items-center" v-bind="$attrs">
    <h1
      class="text-primary font-title-menu-mobile font-bold uppercase text-xl sm:text-3xl p-3 sm:p-5 relative"
    >
      Danh mục combo
    </h1>
    <div class="flex-grow h-0.5 bg-gray-300 mr-5"></div>
  </section>
  <section v-bind="$attrs" class="mb-10">
    <p v-if="comboStore.loading" class="text-center text-gray-500">Đang tải...</p>

    <p v-if="comboStore.error" class="text-center text-red-500">{{ comboStore.error }}</p>

    <div>
      <ul v-if="comboStore.combos.length > 0" class="grid md:grid-cols-3 lg:grid-cols-4 gap-6 p-3">
        <li
          v-for="item in comboStore.combos"
          :key="item.comboId"
          class="rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 bg-white flex flex-col h-full"
        >
          <div class="relative overflow-hidden rounded-t-lg aspect-[4/3]">
            <Info
              class="absolute top-2 right-2 h-7 w-7 bg-black/50 text-white rounded-full shadow-md z-10 cursor-pointer transition-all duration-300 hover:bg-black/70"
            />
            <img
              :src="`${IMG_BASE_URL}${item.image}`"
              :alt="`Hình ảnh ${item.comboName}`"
              class="absolute inset-0 w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            />
          </div>

          <div class="p-4 flex flex-col flex-grow">
            <div class="flex justify-between">
              <h2 class="text-xl text-primary font-semibold w-3/5 break-words cursor-pointer">
                {{ item.comboName }}
              </h2>
              <h2 class="text-xl text-primary font-bold w-2/5 text-right">
                {{ formattedPrice(item.price) }}
              </h2>
            </div>

            <p class="text-gray-600 text-sm mt-2 line-clamp-2 flex-grow">{{ item.description }}</p>

            <div class="mt-3 flex justify-center">
              <button
                @click="addToCart(item)"
                class="w-full py-3 bg-red-600 text-white rounded-full font-semibold text-base hover:bg-red-700 transition-colors duration-300 cursor-pointer"
              >
                Thêm vào giỏ hàng
              </button>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup>
import { onMounted } from 'vue'
import { useComboStore } from '@/stores/comboStore'
import { Info } from 'lucide-vue-next'
import { IMG_BASE_URL } from '../../config'
import { formattedPrice } from '@/utils/formart'
const comboStore = useComboStore()

onMounted(() => {
  comboStore.fetchCombos()
})
</script>

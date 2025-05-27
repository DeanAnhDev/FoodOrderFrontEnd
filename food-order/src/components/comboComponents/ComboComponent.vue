<template>
  <div>
    <ul v-if="combinedItems.length > 0" class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 p-3">
      <li v-for="item in combinedItems" :key="item.id"
        class="rounded-lg shadow-[0_4px_10px_rgba(0,0,0,0.2)] hover:shadow-xl transition-shadow duration-300 bg-white flex flex-col h-full">
        <div class="grid grid-cols-12 gap-2 items-center md:grid-cols-none md:grid-rows-none p-2 relative">
          <Info
            class="absolute top-2 right-2 h-7 w-7 bg-black/50 text-white rounded-full shadow-md z-10 cursor-pointer transition-all duration-300 hover:bg-black/70" />
          <!-- image -->
          <div class="col-span-5 md:col-span-1 overflow-hidden md:rounded-t-lg relative aspect-[4/3]">
            <img :src="`${IMG_BASE_URL}${item.image}`" :alt="`Hình ảnh ${item.type === 'food' ? 'món ăn' : 'combo'}`"
              class="absolute inset-0 w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              @click="goToDetail(category.slug, item.slug, item.type)" />
          </div>
          <!-- content -->
          <div class="col-span-7 md:col-span-1 ml-2 md:ml-0 md:p-4 flex flex-col flex-grow">
            <div class="flex md:justify-between flex-col md:flex-row">
              <h2 class="text-base md:text-xl text-primary font-semibold w-3/5 break-words cursor-pointer"
                @click="goToDetail(category.slug, item.slug, item.type)">
                {{ item.name }}
              </h2>
              <h2 class="text-base md:text-xl text-primary font-bold w-2/5 text-left md:text-right">
                {{ formattedPrice(item.price) }}
              </h2>
            </div>

            <p class="text-gray-600 text-sm mt-2 line-clamp-1 md:line-clamp-2 flex-grow">
              {{ item.description }}
            </p>

            <div class="mt-3 flex justify-center">
              <button @click="addToCart(item)"
                class="w-full py-1 md:py-3 bg-red-600 text-white rounded-lg md:rounded-full font-semibold text-base hover:bg-red-700 transition-colors duration-300 cursor-pointer">
                Thêm vào giỏ hàng
              </button>
            </div>
          </div>
        </div>
      </li>
    </ul>

    <p v-else class="text-center text-gray-500">Danh mục này hiện chưa có sản phẩm.</p>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { IMG_BASE_URL } from '../../config'
import { Info } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import { formattedPrice } from '@/utils/formart'

const props = defineProps({
  category: Object,
})

const router = useRouter()

const combinedItems = computed(() => {
  const foods =
    props.category.foods?.map((food) => ({
      id: food.foodId,
      name: food.foodName,
      image: food.image,
      price: food.price,
      description: food.description,
      slug: food.slug,
      type: 'food',
    })) || []

  const combos =
    props.category.combos?.map((combo) => ({
      id: combo.comboId,
      name: combo.comboName,
      image: combo.image,
      price: combo.price,
      description: combo.description,
      slug: combo.slug,
      type: 'combo',
    })) || []

  return [...foods, ...combos]
})

const goToDetail = (categorySlug, itemSlug, type) => {
  router.push({
    name: type === 'food' ? 'FoodDetail' : 'ComboDetail',
    params: {
      categorySlug,
      [type === 'food' ? 'foodSlug' : 'comboSlug']: itemSlug,
    },
  })
}

const addToCart = (item) => {
  console.log('Đã thêm vào giỏ hàng:', item)
}

</script>

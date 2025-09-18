<template>
  <section class="mt-5 flex items-center" v-bind="$attrs">
    <h1 class="text-primary font-title-menu-mobile font-bold uppercase text-xl sm:text-3xl p-3 sm:p-5 relative">
      Danh mục combo
    </h1>
    <div class="flex-grow h-0.5 bg-gray-300 mr-5"></div>
  </section>
  <section v-bind="$attrs" class="mb-10">


    <p v-if="comboStore.error" class="text-center text-red-500">{{ comboStore.error }}</p>

    <div>
      <ul v-if="comboStore?.combos?.length > 0" class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 p-3">
        <li v-for="item in comboStore.combos" :key="item.comboId"
          class="rounded-lg shadow-[0_4px_10px_rgba(0,0,0,0.2)] hover:shadow-xl transition-shadow duration-300 bg-white flex flex-col h-full">
          <div class="grid grid-cols-12 gap-2 items-center md:grid-cols-none md:grid-rows-none p-2 relative">
            <!-- Info icon -->
            <Info
              class="absolute top-2 right-2 h-7 w-7 bg-black/50 text-white rounded-full shadow-md z-10 cursor-pointer transition-all duration-300 hover:bg-black/70" />

            <!-- Image -->
            <div class="col-span-5 md:col-span-1 overflow-hidden md:rounded-t-lg relative aspect-[4/3]">
              <span v-if="item.promotion?.isActive"
                class="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded z-10">
                {{ getPromotionLabel(item) }}
              </span>
              <img v-if="item.images?.url" :src="`${item.images.url}`" :alt="`Hình ảnh ${item.comboName}`"
                class="absolute inset-0 w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                @click="goToDetail(item.slug)" />
            </div>

            <!-- Content -->
            <div class="col-span-7 md:col-span-1 ml-2 md:ml-0 md:p-2 flex flex-col flex-grow">
              <div class="flex md:justify-between flex-col md:flex-row">
                <h2 class="text-base md:text-xl text-primary font-semibold w-3/5 break-words cursor-pointer"
                  @click="goToDetail(item.slug)">
                  {{ item.comboName }}
                </h2>
                <div class="flex flex-col md:items-end">
                  <!-- Giá gốc nếu có promotion -->
                  <span v-if="item.promotion?.isActive" class="text-gray-400 line-through text-sm md:text-base">
                    {{ formattedPrice(item.price) }}
                  </span>

                  <!-- Giá sau giảm -->
                  <span class="text-primary font-bold text-base md:text-xl">
                    {{ formattedPrice(getFinalPrice(item)) }}
                  </span>
                </div>

              </div>

              <p class="text-gray-600 text-sm mt-2 line-clamp-1 md:line-clamp-2 flex-grow">
                {{ item.description }}
              </p>

              <div class="mt-3 flex justify-center">
                <button v-if="item.quantity > 0" @click="() => handleAddToCart(item)"
                  class="w-full py-1 md:py-3 bg-red-600 text-white rounded-lg md:rounded-full font-semibold text-base hover:bg-red-700 transition-colors duration-300 cursor-pointer">
                  Thêm vào giỏ hàng
                </button>

                <span v-else
                  class="w-full py-1 md:py-3 bg-gray-400 text-white rounded-lg md:rounded-full font-semibold text-base text-center cursor-not-allowed">
                  Hết hàng
                </span>
              </div>

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
import { formattedPrice } from '@/utils/formart'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cartStore'
import { useToast } from 'vue-toastification'
const toast = useToast()

const cartStore = useCartStore()

const comboStore = useComboStore()

const router = useRouter()

onMounted(() => {
  comboStore.fetchCombos()
})


const getFinalPrice = (item) => {
  const promo = item.promotion
  if (promo?.isActive) {
    if (promo.type === 'Percentage') {
      return item.price * (1 - promo.discountAmount / 100)
    } else if (promo.type === 'Amount') {
      return item.price - promo.discountAmount
    }
  }
  return item.price
}

const getPromotionLabel = (item) => {
  const promo = item.promotion
  if (!promo?.isActive) return ''
  if (promo.type === 'Percentage') return `Giảm ${promo.discountAmount}%`
  if (promo.type === 'Amount') return `Giảm ${formattedPrice(promo.discountAmount)}`
  return ''
}

const goToDetail = (comboSlug) => {
  router.push({
    name: 'ComboDetailNav',
    params: {
      comboSlug
    },
  })
}
const handleAddToCart = async (item) => {
  try {
    await cartStore.addToCart({ comboId: item.comboId, quantity: 1 })
    toast.success('Đã thêm vào giỏ hàng!')
  } catch (error) {
    toast.error('Không thể thêm vào giỏ hàng!')
    console.error('Thêm giỏ hàng lỗi:', error)
  }
}

</script>

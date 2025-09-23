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
            <!-- badge khuyến mãi góc trái -->
            <span v-if="item.promotionLabel"
              class="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded z-10">
              {{ item.promotionLabel }}
            </span>
            <img v-if="item.image?.url" :src="`${item.image.url}`"
              :alt="`Hình ảnh ${item.type === 'food' ? 'món ăn' : 'combo'}`"
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


              <div class="w-2/5 text-left md:text-right flex flex-col">
                <span v-if="item.promotionLabel" class="text-gray-400 line-through text-sm mr-1">
                  {{ formattedPrice(item.price) }}
                </span>
                <span class="text-primary font-bold text-base md:text-xl">
                  {{ formattedPrice(item.finalPrice) }}
                </span>
              </div>
            </div>

            <p class="text-gray-600 text-sm mt-2 line-clamp-1 md:line-clamp-2 flex-grow">
              {{ item.description }}
            </p>

            <div class="mt-3 flex justify-center">
              <button v-if="item.quantity > 0" @click="addToCart(item)"
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
    <p v-else class="text-center text-gray-500">Danh mục này hiện chưa có sản phẩm.</p>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Info } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import { formattedPrice } from '@/utils/formart'
import { useCartStore } from '@/stores/cartStore'
import { useAuthStore } from '@/stores/authStore'
import { useToast } from 'vue-toastification'

const toast = useToast()
const cartStore = useCartStore()
const authStore = useAuthStore()

const props = defineProps({
  category: Object,
})

const router = useRouter()

const combinedItems = computed(() => {
  const foods =
    props.category.foods?.map((food) => {
      let finalPrice = food.price
      let promotionLabel = null

      if (food.promotion && food.promotion.isActive) {
        if (food.promotion.type === 'Amount') {
          finalPrice = food.price - food.promotion.discountAmount
          promotionLabel = `Giảm ${formattedPrice(food.promotion.discountAmount)}`
        } else if (food.promotion.type === 'Percentage') {
          finalPrice = food.price * (1 - food.promotion.discountAmount / 100)
          promotionLabel = `Giảm ${food.promotion.discountAmount}%`
        }
      }

      return {
        id: food.foodId,
        name: food.foodName,
        image: food.images,
        price: food.price,
        finalPrice,
        description: food.description,
        slug: food.slug,
        type: 'food',
        quantity: food.quantity ?? 0,
        status: food.status ?? false,
        promotionLabel,
      }
    }) || []

  const combos =
    props.category.combos?.map((combo) => {
      let finalPrice = combo.price
      let promotionLabel = null

      if (combo.promotion && combo.promotion.isActive) {
        if (combo.promotion.type === 'Amount') {
          finalPrice = combo.price - combo.promotion.discountAmount
          promotionLabel = `Giảm ${formattedPrice(combo.promotion.discountAmount)}`
        } else if (combo.promotion.type === 'Percentage') {
          finalPrice = combo.price * (1 - combo.promotion.discountAmount / 100)
          promotionLabel = `Giảm ${combo.promotion.discountAmount}%`
        }
      }

      return {
        id: combo.comboId,
        name: combo.comboName,
        image: combo.images,
        price: combo.price,
        finalPrice,
        description: combo.description,
        slug: combo.slug,
        type: 'combo',
        quantity: combo.quantity ?? 0,
        status: combo.status ?? false,
        promotionLabel,
      }
    }) || []

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
  // Kiểm tra trạng thái đăng nhập
  if (!authStore.isAuthenticated) {
    toast.warning('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!')
    router.push('/login')
    return
  }

  if (!item || !item.type || !item.id) {
    toast.error('Không thể thêm sản phẩm vào giỏ hàng.')
    return
  }

  const payload = {
    quantity: 1,
  }

  if (item.type === 'food') {
    payload.foodId = item.id
  } else if (item.type === 'combo') {
    payload.comboId = item.id
  }

  try {
    cartStore.addToCart(payload)
    toast.success('Đã thêm vào giỏ hàng!')
  } catch (error) {
    toast.error('Thêm vào giỏ hàng thất bại!')
  }
}
</script>

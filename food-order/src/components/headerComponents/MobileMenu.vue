<template>
  <div
    class="fixed top-0 left-0 w-full h-full bg-white shadow-md md:hidden transition-transform duration-300 overflow-y-auto z-100"
    :class="{ '-translate-x-full': !isMenuOpen, 'translate-x-0': isMenuOpen }"
  >
    <!-- Button close menu -->
    <div class="border-b border-gray-200 p-4 flex justify-end">
      <button @click="closeMenu" class="cursor-pointer">
        <X class="text-primary" />
      </button>
    </div>

    <div class="max-w-7xl mx-auto p-4">
      <nav class="flex flex-col space-y-4 mt-8">
        <router-link :to="{ name: 'Home' }" @click="closeMenu">
          <div class="flex justify-between items-center bg-[#f8f7f5] p-2">
            <span class="text-primary text-l uppercase font-title-menu-mobile font-medium">
              Trang chủ
            </span>
            <img
              src="../../assets/img/img-mobile-menu/food.png"
              alt="FoodOrder Logo"
              class="h-30"
            />
          </div>
        </router-link>

        <router-link :to="{ name: 'Menu' }" @click="closeMenu">
          <div class="flex justify-between items-center bg-[#f8f7f5] p-2">
            <span class="text-primary text-l uppercase font-title-menu-mobile font-medium">
              Thực đơn
            </span>
            <img
              src="../../assets/img/img-mobile-menu/food1.png"
              alt="FoodOrder Logo"
              class="h-30"
            />
          </div>
        </router-link>

        <router-link :to="{ name: 'Category' }" @click="closeMenu">
          <div class="flex justify-between items-center bg-[#f8f7f5] p-2">
            <span class="text-primary text-l uppercase font-title-menu-mobile font-medium">
              Danh mục
            </span>
            <img
              src="../../assets/img/img-mobile-menu/food2.png"
              alt="FoodOrder Logo"
              class="h-30"
            />
          </div>
        </router-link>

        <router-link :to="{ name: 'Combo' }" @click="closeMenu">
          <div class="flex justify-between items-center bg-[#f8f7f5] p-2">
            <span class="text-primary text-l uppercase font-title-menu-mobile font-medium">
              Combo
            </span>
            <img
              src="../../assets/img/img-mobile-menu/food3.png"
              alt="FoodOrder Logo"
              class="h-30"
            />
          </div>
        </router-link>

        <router-link :to="{ name: 'AboutUs' }" @click="closeMenu">
          <div class="flex justify-between items-center bg-[#f8f7f5] p-2">
            <span class="text-primary text-l uppercase font-title-menu-mobile font-medium">
              Về chúng tôi
            </span>
            <img
              src="../../assets/img/img-mobile-menu/food4.png"
              alt="FoodOrder Logo"
              class="h-30"
            />
          </div>
        </router-link>
      </nav>
    </div>
  </div>
</template>

<script setup>
import { X } from 'lucide-vue-next'

const props = defineProps(['isMenuOpen'])
const emit = defineEmits(['close'])

const closeMenu = () => {
  emit('close')
}
</script>

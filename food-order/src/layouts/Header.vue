<template>
  <header class="sticky top-0 left-0 w-full bg-white shadow-md py-4 px-6 z-50">
    <div class="max-w-6xl mx-auto flex justify-between items-center">
      <div class="flex items-center space-x-4">
        <button @click="toggleMenu" class="md:hidden flex flex-col space-y-1">
          <span class="block w-6 h-0.5 bg-gray-800 transition-transform duration-300"></span>
          <span class="block w-6 h-0.5 bg-gray-800 transition-opacity duration-300"></span>
          <span class="block w-6 h-0.5 bg-gray-800 transition-transform duration-300"></span>
        </button>
        <router-link :to="{ name: 'Home' }"
          class="text-3xl font-title font-bold md:hidden absolute left-1/2 transform -translate-x-1/2 text-[rgb(228,0,43)]">
          Food Order
        </router-link>

        <!-- Logo on Desktop -->
        <router-link :to="{ name: 'Home' }" class="hidden md:block">
          <img src="../assets/img/logo.png" alt="FoodOrder Logo" class="h-17" />
        </router-link>
        <nav class="hidden md:flex space-x-6">
          <router-link :to="{ name: 'Menu' }"
            class="font-title font-bold text-lg uppercase hover:text-title-hover hover:underline-scale">Thực
            đơn</router-link>
          <router-link :to="{ name: 'Category' }"
            class="font-title font-bold text-lg uppercase hover:text-title-hover hover:underline-scale">Danh
            mục</router-link>
          <router-link :to="{ name: 'Combo' }"
            class="font-title font-bold text-lg uppercase hover:text-title-hover hover:underline-scale">Combo</router-link>
          <router-link :to="{ name: 'AboutUs' }"
            class="font-title font-bold text-lg uppercase hover:text-title-hover hover:underline-scale">Về chúng
            tôi</router-link>
        </nav>
      </div>

      <div class="flex items-center space-x-4">
        <router-link :to="{ name: 'Login' }" class="font-title font-bold text-lg hover:text-title-hover">
          <CircleUserRound class="w-8 h-8" />
        </router-link>
        <router-link to="/cart" class="font-title font-bold text-lg hover:text-title-hover">
          <ShoppingBasket class="w-9 h-9" />
        </router-link>

      </div>
    </div>
  </header>

  <!-- Import Mobile Menu -->
  <MobileMenu :isMenuOpen="isMenuOpen" @close="toggleMenu" />
</template>

<script setup>
import { ref, watch } from 'vue'
import { ShoppingBasket, CircleUserRound } from 'lucide-vue-next'
import MobileMenu from '../components/headerComponents/MobileMenu.vue'

const isMenuOpen = ref(false)

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

watch(isMenuOpen, (newVal) => {
  if (newVal) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})
</script>

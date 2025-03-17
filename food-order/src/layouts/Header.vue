<template>
  <header class="bg-white shadow-md py-4 px-6">
    <div class="max-w-6xl mx-auto flex justify-between items-center">
      <div class="flex items-center space-x-4">
        <button @click="toggleMenu" class="md:hidden flex flex-col space-y-1">
          <span class="block w-6 h-0.5 bg-gray-800 transition-transform duration-300"></span>
          <span class="block w-6 h-0.5 bg-gray-800 transition-opacity duration-300"></span>
          <span class="block w-6 h-0.5 bg-gray-800 transition-transform duration-300"></span>
        </button>
        <router-link
          to="/"
          class="text-3xl font-title font-bold md:hidden absolute left-1/2 transform -translate-x-1/2 text-[rgb(228,0,43)]"
        >
          Food Order
        </router-link>

        <!-- Logo on Desktop -->
        <router-link to="/" class="hidden md:block">
          <img src="../assets/img/logo.png" alt="FoodOrder Logo" class="h-17" />
        </router-link>
        <!-- Menu on desktop -->
        <nav class="hidden md:flex space-x-6">
          <router-link
            to="/"
            class="font-title font-bold text-lg uppercase hover:text-title-hover hover:underline-scale"
            >Thực đơn</router-link
          >
          <router-link
            to="/"
            class="font-title font-bold text-lg uppercase hover:text-title-hover hover:underline-scale"
            >Danh mục</router-link
          >
          <router-link
            to="/"
            class="font-title font-bold text-lg uppercase hover:text-title-hover hover:underline-scale"
            >Combo</router-link
          >
          <router-link
            to="/"
            class="font-title font-bold text-lg uppercase hover:text-title-hover hover:underline-scale"
            >Về chúng tôi</router-link
          >
        </nav>
      </div>

      <div class="flex items-center space-x-4">
        <router-link to="/" class="font-title font-bold text-lg hover:text-title-hover">
          <CircleUserRound class="w-8 h-8" />
        </router-link>
        <router-link to="/" class="font-title font-bold text-lg hover:text-title-hover">
          <ShoppingBasket class="w-8 h-8" />
        </router-link>
      </div>
    </div>

    <!-- Menu Mobile -->
    <div
      class="fixed top-0 left-0 w-full h-full bg-white shadow-md md:hidden transition-transform duration-300"
      :class="{ '-translate-x-full': !isMenuOpen, 'translate-x-0': isMenuOpen }"
    >
      <!-- Nút đóng menu -->
      <button @click="toggleMenu" class="absolute top-4 right-4 text-2xl">
        <X class="text-primary" />
      </button>

      <div class="max-w-7xl mx-auto p-4">
        <nav class="flex flex-col space-y-4 mt-10">
          <router-link to="/" class="font-title font-bold text-lg" @click="toggleMenu">
            Trang chủ
          </router-link>
          <router-link to="/" class="font-title font-bold text-lg" @click="toggleMenu">
            Thực đơn
          </router-link>
          <router-link to="/" class="font-title font-bold text-lg" @click="toggleMenu">
            Danh mục
          </router-link>
          <router-link to="/" class="font-title font-bold text-lg" @click="toggleMenu">
            Combo
          </router-link>
          <router-link to="/" class="font-title font-bold text-lg" @click="toggleMenu">
            Về chúng tôi
          </router-link>
        </nav>
      </div>
    </div>
  </header>
</template>

<script setup>
import { X, ShoppingBasket, CircleUserRound } from 'lucide-vue-next'
import { ref } from 'vue'

const isMenuOpen = ref(false)

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}
</script>

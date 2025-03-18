<template>
  <div>
    <div class="bg-[#202124] w-full">
      <section class="text-white">
        <div
          class="flex flex-wrap items-center justify-center gap-4 p-4 text-center sm:flex-nowrap"
        >
          <div class="flex items-center gap-2">
            <Truck class="h-6 w-6 sm:h-8 sm:w-8 text-red-600 stroke-current" />
            <p class="font-bold text-xs sm:text-sm">Giao Hàng</p>
          </div>

          <div class="flex items-center gap-2">
            <Package class="h-6 w-6 sm:h-8 sm:w-8 text-red-600 stroke-current" />
            <p class="font-bold text-xs sm:text-sm">hoặc Mang đi</p>
          </div>
          <button
            class="w-full sm:w-auto px-6 py-2 border-2 border-red-600 bg-red-600 text-white rounded-full font-semibold text-sm hover:bg-red-700 hover:border-red-700 transition duration-300 cursor-pointer"
          >
            Bắt đầu đặt hàng
          </button>
        </div>
      </section>
    </div>

    <div class="relative w-full">
      <Swiper
        :modules="[Navigation, Pagination, Autoplay]"
        :slides-per-view="1"
        :space-between="0"
        :loop="true"
        :autoplay="{ delay: 3000, disableOnInteraction: false }"
        :pagination="{ clickable: true }"
        :navigation="true"
        class="custom-swiper"
      >
        <SwiperSlide v-for="(slide, index) in slides" :key="index">
          <div class="w-full">
            <img
              :src="slide.image"
              :alt="'Slide ' + (index + 1)"
              class="w-full object-cover object-center"
            />
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  </div>
</template>

<script setup>
import { Truck } from 'lucide-vue-next'
import { Package } from 'lucide-vue-next'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
const slides = [{ image: '/banner.JPG' }, { image: '/banner1.jpg' }, { image: '/banner3.jpg' }]

// func control Swiper
const prevSlide = () => document.querySelector('.swiper-button-prev')?.click()
const nextSlide = () => document.querySelector('.swiper-button-next')?.click()
</script>

<style>
.custom-swiper .swiper-button-prev,
.custom-swiper .swiper-button-next {
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  width: 40px;
  height: 50px;
}

.custom-swiper .swiper-button-prev {
  left: 0;
}
.custom-swiper .swiper-button-next {
  right: 0;
}
.custom-swiper .swiper-button-prev::after,
.custom-swiper .swiper-button-next::after {
  font-size: 16px;
  font-weight: bold;
}
</style>

<template>
  <ul class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 p-3">
    <li
      v-for="(food, index) in category.foods"
      :key="food.foodId"
      class="rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 bg-white flex flex-col h-full"
      :class="{ 'sm:col-span-2 md:col-span-1': index === 0 }"
    >
      <div class="relative overflow-hidden rounded-t-lg aspect-[4/3]">
        <img
          :src="`https://localhost:7289/${food.image}`"
          alt="Hình ảnh món ăn"
          class="absolute inset-0 w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>

      <div class="p-3 flex flex-col flex-grow">
        <div class="flex justify-between">
          <h2 class="text-lg sm:text-xl text-primary font-semibold break-words cursor-pointer">
            {{ food.foodName }}
          </h2>
          <h2 class="text-lg sm:text-xl text-primary font-bold">
            {{ formattedPrice(food.price) }}
          </h2>
        </div>

        <p class="text-gray-600 text-sm mt-2 flex-grow">
          {{ food.description }}
        </p>

        <div class="mt-3 flex justify-center">
          <button
            @click="addToCart(food)"
            class="w-full py-2 sm:py-3 bg-red-600 text-white rounded-full font-semibold text-sm sm:text-base hover:bg-red-700 transition-colors duration-300 cursor-pointer"
          >
            Thêm vào giỏ hàng
          </button>
        </div>
      </div>
    </li>
  </ul>
</template>

<script setup></script>

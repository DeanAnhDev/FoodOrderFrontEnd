<template>
  <footer class="bg-[#202124] text-white py-8">
    <div class="max-w-6xl mx-auto px-6">
      <!-- Grid layout -->
      <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
        <div v-for="(item, index) in menuItems" :key="index">
          <h3
            class="mb-3 font-bold text-lg flex justify-between items-center md:cursor-default"
            @click="toggleMenu(index)"
          >
            {{ item.title }}
            <span
              class="text-xl transition-transform duration-300 md:hidden"
              :class="{ 'rotate-180': isOpen[index] }"
            >
              <ChevronDown />
            </span>
          </h3>
          <ul
            v-if="isOpen[index] || isLargeScreen"
            class="transition-all duration-500 ease-in-out overflow-hidden"
            :class="isOpen[index] || isLargeScreen ? 'opacity-100 py-2' : ''"
          >
            <li v-for="(link, i) in item.links" :key="i">
              <a href="#" class="hover:text-white text-[15px] text-gray-400 block py-1">
                {{ link }}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <!-- Copyright -->
      <div class="mt-8 text-center border-t border-gray-600 pt-4 text-sm">
        <p class="text-[#ababab]">Copyright &copy; 2025 DeanAnhDev. All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ChevronDown } from 'lucide-vue-next'
import { ref, onMounted, onUnmounted } from 'vue'

const menuItems = ref([
  { title: 'Danh mục món ăn', links: ['Liên kết 1', 'Liên kết 2', 'Liên kết 3'] },
  { title: 'Về Food Order', links: ['Liên kết 1', 'Liên kết 2', 'Liên kết 3'] },
  { title: 'Liên hệ', links: ['Liên kết 1', 'Liên kết 2', 'Liên kết 3'] },
  { title: 'Chính sách', links: ['Liên kết 1', 'Liên kết 2', 'Liên kết 3'] },
  { title: 'Cột 5', links: ['Liên kết 1', 'Liên kết 2', 'Liên kết 3'] },
])

const isOpen = ref(Array(menuItems.value.length).fill(false))
const isLargeScreen = ref(window.innerWidth >= 768)

const toggleMenu = (index) => {
  if (!isLargeScreen.value) {
    isOpen.value[index] = !isOpen.value[index]
  }
}

const updateScreenSize = () => {
  isLargeScreen.value = window.innerWidth >= 768
  if (isLargeScreen.value) {
    isOpen.value = Array(menuItems.value.length).fill(true) // Mở hết trên desktop
  } else {
    isOpen.value = Array(menuItems.value.length).fill(false) // Ẩn hết trên mobile
  }
}

onMounted(() => {
  updateScreenSize()
  window.addEventListener('resize', updateScreenSize)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateScreenSize)
})
</script>

<template>
  <div class="flex max-w-6xl mx-auto p-4 gap-6">
    <!-- Sidebar -->
    <aside class="w-1/4 bg-black text-white rounded-lg p-6 space-y-4">
      <div class="flex flex-col items-center">
        <img src="@/assets/img/logo.png" alt="Logo" class="w-16 h-16 mb-2" />
        <h2 class="text-xl font-bold text-center">Xin chào,<br />{{ userName }}!</h2>
        <RouterLink to="/logout" class="text-sm underline">Đăng xuất</RouterLink>
      </div>
      <ul class="space-y-2 mt-4 text-sm">
        <li>
          <RouterLink to="/account/orders" class="hover:underline">Đơn hàng đã đặt</RouterLink>
        </li>
        <li>
          <RouterLink to="/account/addresses" class="hover:underline">Địa chỉ của bạn</RouterLink>
        </li>
        <li>
          <RouterLink to="/account/info" class="hover:underline">Chi tiết tài khoản</RouterLink>
        </li>
        <li>
          <RouterLink to="/account/password" class="hover:underline">Đặt lại mật khẩu</RouterLink>
        </li>
      </ul>
    </aside>

    <!-- Nội dung bên phải -->
    <section class="w-3/4">
      <RouterView />
    </section>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useUserStore } from '@/stores/userStore'

const userStore = useUserStore()

const userName = computed(() => userStore.user?.fullName || 'Người dùng')

onMounted(() => {
  if (!userStore.user) {
    userStore.fetchUser()
  }
})
</script>

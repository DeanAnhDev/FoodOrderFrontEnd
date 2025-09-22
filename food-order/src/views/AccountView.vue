<template>
  <div class="account-layout max-w-6xl mx-auto p-4">
    <div class="flex gap-6">
      <!-- Sidebar -->
      <aside class="account-sidebar">
        <div class="flex flex-col items-center">
          <img src="@/assets/img/logo.png" alt="Logo" class="w-16 h-16 mb-2" />
          <h2 class="text-xl font-bold text-center">Xin chào,<br />{{ userName }}!</h2>
          <RouterLink to="/logout" class="text-sm link-logout">Đăng xuất</RouterLink>
        </div>

        <nav class="mt-4">
          <ul class="space-y-2 text-sm">
            <li>
              <RouterLink to="/account/orders" class="nav-link" active-class="active">Đơn hàng đã đặt</RouterLink>
            </li>
            <li>
              <RouterLink to="/account/addresses" class="nav-link" active-class="active">Địa chỉ của bạn</RouterLink>
            </li>
            <li>
              <RouterLink to="/account/info" class="nav-link" active-class="active">Chi tiết tài khoản</RouterLink>
            </li>
            <li>
              <RouterLink to="/account/password" class="nav-link" active-class="active">Đặt lại mật khẩu</RouterLink>
            </li>
          </ul>
        </nav>
      </aside>

      <!-- Nội dung bên phải -->
      <section class="flex-1">
        <transition name="fade" mode="out-in">
          <div class="content-card" key="$route.fullPath">
            <RouterView />
          </div>
        </transition>
      </section>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useUserStore } from '@/stores/userStore'
import { useRouter, useRoute } from 'vue-router'

const userStore = useUserStore()
const router = useRouter()
const route = useRoute()

const userName = computed(() => userStore.user?.fullName || 'Người dùng')

onMounted(() => {
  if (!userStore.user) {
    userStore.fetchUser()
  }

  // Redirect to orders if on base account path
  if (route.path === '/account' || route.path === '/account/') {
    router.push('/account/orders')
  }
})
</script>

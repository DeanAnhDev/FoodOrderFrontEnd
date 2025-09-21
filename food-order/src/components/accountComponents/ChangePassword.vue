<template>
  <div class="max-w-xl mx-auto px-4">
    <h1 class="text-2xl md:text-3xl font-semibold mb-4 text-gray-800">Đổi mật khẩu tài khoản</h1>
    <p class="text-sm text-gray-500 mb-6">Vui lòng nhập mật khẩu hiện tại và đặt mật khẩu mới an toàn.</p>

    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Mật khẩu hiện tại -->
      <div class="flex flex-col relative">
        <label for="oldPassword" class="text-sm text-gray-600 mb-1">Mật khẩu hiện tại <span
            class="text-red-500">*</span></label>
        <input id="oldPassword" :type="showOldPassword ? 'text' : 'password'" v-model="form.oldPassword"
          placeholder="Nhập mật khẩu hiện tại" autocomplete="current-password" required
          class="w-full border border-gray-200 rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-400" />
        <button type="button" @click="showOldPassword = !showOldPassword" aria-label="Toggle old password visibility"
          class="absolute right-3 top-9 text-gray-500">
          <svg v-if="!showOldPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none"
            viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.97 9.97 0 012.69-4.198l1.414 1.414A7.977 7.977 0 004.5 12c1.274 4.057 5.065 7 9.542 7 .545 0 1.078-.044 1.586-.13l-1.753-0.045z" />
            <path d="M3 3l18 18-1.5 1.5L1.5 4.5 3 3z" />
          </svg>
        </button>
      </div>

      <!-- Mật khẩu mới -->
      <div class="flex flex-col relative">
        <label for="newPassword" class="text-sm text-gray-600 mb-1">Mật khẩu mới <span
            class="text-red-500">*</span></label>
        <input id="newPassword" :type="showNewPassword ? 'text' : 'password'" v-model="form.newPassword"
          placeholder="Ít nhất 8 ký tự" autocomplete="new-password" required
          class="w-full border border-gray-200 rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-400" />
        <button type="button" @click="showNewPassword = !showNewPassword" aria-label="Toggle new password visibility"
          class="absolute right-3 top-9 text-gray-500">
          <svg v-if="!showNewPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none"
            viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.97 9.97 0 012.69-4.198l1.414 1.414A7.977 7.977 0 004.5 12c1.274 4.057 5.065 7 9.542 7 .545 0 1.078-.044 1.586-.13l-1.753-0.045z" />
            <path d="M3 3l18 18-1.5 1.5L1.5 4.5 3 3z" />
          </svg>
        </button>
        <p class="text-xs text-gray-400 mt-2">Sử dụng chữ hoa, chữ thường, số và ký tự đặc biệt để tăng tính bảo mật.
        </p>
      </div>

      <!-- Xác nhận mật khẩu -->
      <div class="flex flex-col relative">
        <label for="confirmPassword" class="text-sm text-gray-600 mb-1">Xác nhận mật khẩu <span
            class="text-red-500">*</span></label>
        <input id="confirmPassword" :type="showConfirmPassword ? 'text' : 'password'" v-model="form.confirmPassword"
          placeholder="Nhập lại mật khẩu mới" autocomplete="new-password" required
          class="w-full border border-gray-200 rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-400" />
        <button type="button" @click="showConfirmPassword = !showConfirmPassword"
          aria-label="Toggle confirm password visibility" class="absolute right-3 top-9 text-gray-500">
          <svg v-if="!showConfirmPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none"
            viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.97 9.97 0 012.69-4.198l1.414 1.414A7.977 7.977 0 004.5 12c1.274 4.057 5.065 7 9.542 7 .545 0 1.078-.044 1.586-.13l-1.753-0.045z" />
            <path d="M3 3l18 18-1.5 1.5L1.5 4.5 3 3z" />
          </svg>
        </button>
      </div>

      <!-- Nút gửi -->
      <button type="submit" :disabled="userStore.loading"
        class="bg-red-600 hover:bg-red-700 text-white w-full py-3 rounded-full font-semibold shadow-md disabled:opacity-50">
        {{ userStore.loading ? 'Đang xử lý...' : 'Cập nhật mật khẩu' }}
      </button>
    </form>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useUserStore } from '@/stores/userStore'
import { useAuthStore } from '@/stores/authStore'
import { useToast } from 'vue-toastification'
import { useRouter } from 'vue-router'
const router = useRouter()

const toast = useToast()
const userStore = useUserStore()

const form = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
})

const showOldPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)

const handleSubmit = async () => {
  if (form.newPassword !== form.confirmPassword) {
    toast.error('Mật khẩu xác nhận không khớp!')
    return
  }

  try {
    await userStore.changeUserPassword({
      currentPassword: form.oldPassword,
      newPassword: form.newPassword,
      confirmNewPassword: form.confirmPassword,
    })

    toast.success('Đổi mật khẩu thành công!')

    const authStore = useAuthStore()
    await authStore.logout()

    router.push('/login')
  } catch (err) {
    const message =
      err.response?.data?.message ||
      err.response?.data ||
      err.message ||
      toast.error(` ${message}`)
  }
}


</script>

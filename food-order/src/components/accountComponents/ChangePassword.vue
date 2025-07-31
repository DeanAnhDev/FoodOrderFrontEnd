<template>
  <div class="max-w-xl mx-auto">
    <h1 class="text-2xl md:text-3xl font-extrabold mb-8 uppercase">Đặt lại mật khẩu</h1>

    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Mật khẩu hiện tại -->
      <div class="flex flex-col relative">
        <label class="text-sm text-gray-600 mb-1">Mật khẩu hiện tại *</label>
        <input :type="showOldPassword ? 'text' : 'password'" v-model="form.oldPassword" autocomplete="current-password"
          required class="border-b border-gray-300 py-2 pr-10 focus:outline-none focus:border-red-500" />
        <span @click="showOldPassword = !showOldPassword" class="absolute right-2 top-8 cursor-pointer text-gray-500">
          👁️
        </span>
      </div>

      <!-- Mật khẩu mới -->
      <div class="flex flex-col relative">
        <label class="text-sm text-gray-600 mb-1">Mật khẩu *</label>
        <input :type="showNewPassword ? 'text' : 'password'" v-model="form.newPassword" autocomplete="new-password"
          required class="border-b border-gray-300 py-2 pr-10 focus:outline-none focus:border-red-500" />
        <span @click="showNewPassword = !showNewPassword" class="absolute right-2 top-8 cursor-pointer text-gray-500">
          👁️
        </span>
      </div>

      <!-- Xác nhận mật khẩu -->
      <div class="flex flex-col relative">
        <label class="text-sm text-gray-600 mb-1">Xác nhận mật khẩu *</label>
        <input :type="showConfirmPassword ? 'text' : 'password'" v-model="form.confirmPassword"
          autocomplete="new-password" required
          class="border-b border-gray-300 py-2 pr-10 focus:outline-none focus:border-red-500" />
        <span @click="showConfirmPassword = !showConfirmPassword"
          class="absolute right-2 top-8 cursor-pointer text-gray-500">
          👁️
        </span>
      </div>

      <!-- Nút gửi -->
      <button type="submit" :disabled="userStore.loading"
        class="bg-red-600 hover:bg-red-700 text-white w-full py-3 rounded-full font-semibold shadow-md disabled:opacity-50">
        {{ userStore.loading ? 'Đang xử lý...' : 'Đổi mật khẩu' }}
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

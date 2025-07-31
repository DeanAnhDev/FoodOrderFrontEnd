<template>
  <div class="max-w-xl mx-auto">
    <h1 class="text-2xl md:text-3xl font-extrabold mb-8 uppercase">Đặt lại mật khẩu</h1>

    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Mật khẩu hiện tại -->
      <div class="flex flex-col relative">
        <label class="text-sm text-gray-600 mb-1">Mật khẩu hiện tại *</label>
        <input
          :type="showOldPassword ? 'text' : 'password'"
          v-model="form.oldPassword"
          required
          class="border-b border-gray-300 py-2 pr-10 focus:outline-none focus:border-red-500"
        />
        <span
          @click="showOldPassword = !showOldPassword"
          class="absolute right-2 top-8 cursor-pointer text-gray-500"
        >
          👁️
        </span>
      </div>

      <!-- Mật khẩu mới -->
      <div class="flex flex-col relative">
        <label class="text-sm text-gray-600 mb-1">Mật khẩu *</label>
        <input
          :type="showNewPassword ? 'text' : 'password'"
          v-model="form.newPassword"
          required
          class="border-b border-gray-300 py-2 pr-10 focus:outline-none focus:border-red-500"
        />
        <span
          @click="showNewPassword = !showNewPassword"
          class="absolute right-2 top-8 cursor-pointer text-gray-500"
        >
          👁️
        </span>
      </div>

      <!-- Xác nhận mật khẩu -->
      <div class="flex flex-col relative">
        <label class="text-sm text-gray-600 mb-1">Xác nhận mật khẩu *</label>
        <input
          :type="showConfirmPassword ? 'text' : 'password'"
          v-model="form.confirmPassword"
          required
          class="border-b border-gray-300 py-2 pr-10 focus:outline-none focus:border-red-500"
        />
        <span
          @click="showConfirmPassword = !showConfirmPassword"
          class="absolute right-2 top-8 cursor-pointer text-gray-500"
        >
          👁️
        </span>
      </div>

      <!-- Nút gửi -->
      <button
        type="submit"
        class="bg-red-600 hover:bg-red-700 text-white w-full py-3 rounded-full font-semibold shadow-md"
      >
        Đổi mật khẩu
      </button>
    </form>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'

const form = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
})

const showOldPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)

const handleSubmit = () => {
  if (form.newPassword !== form.confirmPassword) {
    alert('Mật khẩu xác nhận không khớp!')
    return
  }

  // Gửi API đổi mật khẩu ở đây
  console.log('Đổi mật khẩu với:', form)
  alert('Đổi mật khẩu thành công!')
}
</script>

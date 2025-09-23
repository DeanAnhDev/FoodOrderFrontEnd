<template>
  <div class="max-w-xl mx-auto p-6">
    <h1 class="text-2xl font-bold mb-6">Chi tiết tài khoản</h1>

    <!-- Kiểm tra form có dữ liệu -->
    <form v-if="form" @submit.prevent="submit" class="space-y-5">

      <div class="space-y-6">
        <!-- Tên -->
        <div class="flex flex-col">
          <label class="text-sm text-gray-600 mb-1">Tên của bạn *</label>
          <input v-model="form.fullName" type="text" placeholder="Tên của bạn"
            class="border-b border-gray-300 focus:outline-none focus:border-red-500 py-2" required />
        </div>

        <!-- Số điện thoại -->
        <div class="flex flex-col">
          <label class="text-sm text-gray-600 mb-1">Số điện thoại của bạn *</label>
          <input :value="form.phoneNumber" type="text" disabled
            class="border-b border-gray-300 text-gray-500 bg-transparent py-2 cursor-not-allowed" />
        </div>

        <!-- Email -->
        <div class="flex flex-col">
          <label class="text-sm text-gray-600 mb-1">Địa chỉ email của bạn *</label>
          <input :value="form.email" type="email" disabled
            class="border-b border-gray-300 text-gray-500 bg-transparent py-2 cursor-not-allowed" />
        </div>
      </div>

      <button type="submit" class="bg-red-600 text-white w-full py-3 rounded-full mt-6 hover:bg-red-700 transition">
        Cập nhật tài khoản
      </button>
    </form>

    <!-- Hiển thị loading hoặc lỗi -->
    <div v-else-if="loading" class="text-center text-gray-500 mt-4">Đang tải dữ liệu...</div>
    <div v-else-if="error" class="text-red-500 text-center mt-4">{{ error }}</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/stores/userStore'
import { useToast } from 'vue-toastification'

const toast = useToast()
const userStore = useUserStore()
const { fetchUser, updateUserInfo, loading, error } = userStore

const form = ref({
  fullName: '',
  phoneNumber: '',
  email: ''
})

onMounted(async () => {
  await fetchUser()

  if (userStore.user) {
    form.value.fullName = userStore.user.fullName
    form.value.phoneNumber = userStore.user.phoneNumber
    form.value.email = userStore.user.email
  }
})

const submit = async () => {
  try {
    await updateUserInfo({
      fullName: form.value.fullName,
      phoneNumber: form.value.phoneNumber,
      email: form.value.email,
    })

    await fetchUser()

    toast.success('🎉 Cập nhật thành công!')
  } catch (err) {
    toast.error(' Cập nhật thất bại!')
  }
}
</script>

<template>
  <section v-bind="$attrs" class="flex flex-col-reverse md:flex-row items-center">
    <div class="w-full md:w-5/12">
      <img src="/banner-login.png" alt="banner" class="w-full" />
    </div>
    <div class="w-full md:w-7/12 mx-auto">
      <div class="bg-white p-10 md:p-16 lg:p-20">
        <h1 class="text-4xl font-title-menu-mobile font-bold uppercase">Tạo tài khoản</h1>

        <form class="mt-8" @submit.prevent="handleSubmit">
          <!-- Full name -->
          <div class="relative mb-8">
            <input type="text" id="name" autocomplete="name" v-model="name" @focus="focused.name = true"
              @blur="handleBlur('name')"
              class="w-full pb-2 border-b border-gray-300 outline-none focus:border-transparent" placeholder=" " />
            <span class="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 transition-all duration-500 ease-in-out"
              :class="{ 'w-full': focused.name }"></span>
            <label for="name" class="absolute left-0 text-primary text-base transition-all duration-500 ease-in-out"
              :class="{ '-translate-y-6 text-indigo-500 left-0 text-xs': focused.name || name }">
              Họ và tên của bạn
            </label>
          </div>

          <!-- Phone number -->
          <div class="relative mb-8">
            <input type="tel" id="phoneNumber" autocomplete="tel" v-model="phoneNumber"
              @focus="focused.phoneNumber = true" @blur="handleBlur('phoneNumber')"
              class="w-full pb-2 border-b border-gray-300 outline-none focus:border-transparent" placeholder=" " />
            <span class="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 transition-all duration-500 ease-in-out"
              :class="{ 'w-full': focused.phoneNumber }"></span>
            <label for="phoneNumber"
              class="absolute left-0 text-primary text-base transition-all duration-500 ease-in-out" :class="{
                '-translate-y-6 text-indigo-500 left-0 text-xs': focused.phoneNumber || phoneNumber,
              }">
              Số điện thoại của bạn
            </label>
          </div>

          <!-- Email -->
          <div class="relative mb-8">
            <input type="email" id="email" autocomplete="email" v-model="email" @focus="focused.email = true"
              @blur="handleBlur('email')"
              class="w-full pb-2 border-b border-gray-300 outline-none focus:border-transparent" placeholder=" " />
            <span class="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 transition-all duration-500 ease-in-out"
              :class="{ 'w-full': focused.email }"></span>
            <label for="email" class="absolute left-0 text-primary text-base transition-all duration-500 ease-in-out"
              :class="{ '-translate-y-6 text-indigo-500 left-0 text-xs': focused.email || email }">
              Địa chỉ email của bạn
            </label>
          </div>

          <!-- Password -->
          <div class="relative mb-6">
            <input type="password" id="password" autocomplete="new-password" v-model="password"
              @focus="focused.password = true" @blur="handleBlur('password')"
              class="w-full pb-2 border-b border-gray-300 outline-none focus:border-transparent" placeholder=" " />
            <span class="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 transition-all duration-500 ease-in-out"
              :class="{ 'w-full': focused.password }"></span>
            <label for="password" class="absolute left-0 text-primary text-base transition-all duration-500 ease-in-out"
              :class="{ '-translate-y-6 text-xs': focused.password || password }">
              Mật khẩu
            </label>
          </div>

          <!-- Confirm password -->
          <div class="relative mb-6">
            <input type="password" id="comfirmPassword" autocomplete="new-password" v-model="comfirmPassword"
              @focus="focused.comfirmPassword = true" @blur="handleBlur('comfirmPassword')"
              class="w-full pb-2 border-b border-gray-300 outline-none focus:border-transparent" placeholder=" " />
            <span class="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 transition-all duration-500 ease-in-out"
              :class="{ 'w-full': focused.comfirmPassword }"></span>
            <label for="comfirmPassword"
              class="absolute left-0 text-primary text-base transition-all duration-500 ease-in-out"
              :class="{ '-translate-y-6 text-xs': focused.comfirmPassword || comfirmPassword }">
              Xác nhận mật khẩu
            </label>
          </div>

          <!-- Accept terms -->
          <div class="mb-4 flex items-start gap-3">
            <input type="checkbox" id="terms"
              class="h-6 w-6 cursor-pointer accent-red-600 border border-gray-400 rounded" />
            <p class="text-sm text-gray-700 leading-relaxed">
              Tôi đã đọc và đồng ý với các
              <router-link to="/policy" class="text-pimary hover:underline font-semibold">
                Chính sách hoạt động
              </router-link>
              và
              <router-link to="/privacy" class="text-pimary hover:underline font-semibold">
                Chính sách bảo mật thông tin của FoodOrder </router-link>.
            </p>
          </div>

          <!-- Submit button -->
          <div class="mb-6">
            <button type="submit"
              class="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-full cursor-pointer font-bold transition duration-300 focus:outline-none focus:ring-2 focus:ring-red-400">
              Đăng kí
            </button>
          </div>

          <!-- Already have account -->
          <div class="mt-8 text-center">
            <span>Bạn đã có tài khoản?</span>
            <router-link :to="{ name: 'Login' }" class="font-bold underline ml-2">Đăng nhập</router-link>
          </div>
        </form>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const router = useRouter()
const authStore = useAuthStore()

const name = ref('')
const phoneNumber = ref('')
const email = ref('')
const password = ref('')
const comfirmPassword = ref('')

const focused = ref({
  name: false,
  phoneNumber: false,
  email: false,
  password: false,
  comfirmPassword: false,
})

const handleBlur = (field) => {
  if (!name.value && field === 'name') focused.value.name = false
  if (!phoneNumber.value && field === 'phoneNumber') focused.value.phoneNumber = false
  if (!email.value && field === 'email') focused.value.email = false
  if (!password.value && field === 'password') focused.value.password = false
  if (!comfirmPassword.value && field === 'comfirmPassword') focused.value.comfirmPassword = false
}

const handleSubmit = async () => {
  // Kiểm tra bắt buộc
  if (!name.value || !phoneNumber.value || !email.value || !password.value || !comfirmPassword.value) {
    alert('Vui lòng nhập đầy đủ thông tin!')
    return
  }

  // Kiểm tra email định dạng đơn giản
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email.value)) {
    alert('Email không hợp lệ!')
    return
  }

  // Kiểm tra xác nhận mật khẩu
  if (password.value !== comfirmPassword.value) {
    alert('Mật khẩu xác nhận không khớp!')
    return
  }

  // Có thể thêm: kiểm tra độ dài mật khẩu, ký tự đặc biệt...
  if (password.value.length < 6) {
    alert('Mật khẩu phải có ít nhất 6 ký tự!')
    return
  }

  // Gọi API thông qua store
  await authStore.register({
    fullName: name.value,
    phoneNumber: phoneNumber.value,
    email: email.value,
    password: password.value,
  })

  if (!authStore.error) {
    alert(authStore.message)
    router.push({ name: 'Login' })
  } else {
    alert(authStore.error)
  }
}

</script>

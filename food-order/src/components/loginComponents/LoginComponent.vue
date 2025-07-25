<template>
  <section v-bind="$attrs" class="flex flex-col-reverse md:flex-row items-center">
    <div class="w-full md:w-5/12">
      <img src="/banner-login.png" alt="banner" class="w-full" />
    </div>
    <div class="w-full md:w-7/12 mx-auto">
      <div class="bg-white p-10 md:p-16 lg:p-20">
        <h1 class="text-4xl font-title-menu-mobile font-bold uppercase">Đăng nhập</h1>

        <form class="mt-8" @submit.prevent="handleSubmit">
          <!-- Username -->
          <div class="relative mb-8">
            <input
              type="text"
              id="username"
              autocomplete="username"
              v-model="username"
              @focus="focused.username = true"
              @blur="handleBlur('username')"
              class="w-full pb-2 border-b border-gray-300 outline-none focus:border-transparent"
              placeholder=" "
            />
            <span
              class="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 transition-all duration-500 ease-in-out"
              :class="{ 'w-full': focused.username }"
            ></span>
            <label
              for="username"
              class="absolute left-0 text-primary text-base transition-all duration-500 ease-in-out"
              :class="{ '-translate-y-6 text-indigo-500 left-0 text-xs': focused.username || username }"
            >
              Địa chỉ email hoặc số điện thoại
            </label>
          </div>

          <!-- Password with show/hide -->
          <div class="relative mb-6">
            <input
              :type="showPassword ? 'text' : 'password'"
              id="password"
              autocomplete="current-password"
              v-model="password"
              @focus="focused.password = true"
              @blur="handleBlur('password')"
              class="w-full pb-2 border-b border-gray-300 outline-none focus:border-transparent pr-10"
              placeholder=" "
            />
            <!-- Toggle eye -->
            <button
              type="button"
              @click="toggleShowPassword"
              class="absolute right-0 top-0 bottom-2 px-2 text-gray-600"
            >
              {{ showPassword ? '🙈' : '👁️' }}
            </button>

            <span
              class="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 transition-all duration-500 ease-in-out"
              :class="{ 'w-full ': focused.password }"
            ></span>
            <label
              for="password"
              class="absolute left-0 text-primary text-base transition-all duration-500 ease-in-out"
              :class="{ '-translate-y-6 text-xs': focused.password || password }"
            >
              Mật khẩu
            </label>
          </div>

          <div class="mb-4 text-right">
            <label class="cursor-pointer">Bạn quên mật khẩu?</label>
          </div>

          <div class="mb-6">
            <button
              type="submit"
              class="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-full cursor-pointer font-bold transition duration-300 focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              Đăng nhập
            </button>
          </div>
        </form>

        <!-- Social login -->
        <div>
          <h5 class="font-title-menu-mobile font-bold text-lg">Hoặc tiếp tục với</h5>
          <div class="flex flex-col gap-4 mt-6">
            <button
              class="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-full cursor-pointer font-bold flex items-center justify-center gap-2"
            >
              <img src="/facebook-icon.png" alt="facebook-icon" class="w-6 h-6" />
              Facebook
            </button>
            <button
              class="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-full cursor-pointer font-bold flex items-center justify-center gap-2"
            >
              <img src="/google-icon.png" alt="google-icon" class="w-6 h-6" />
              Google
            </button>
          </div>
        </div>

        <div class="mt-8 text-center">
          <span>Bạn chưa có tài khoản?</span>
          <router-link :to="{ name: 'Register' }" class="font-bold underline ml-2">Đăng ký</router-link>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { useAuthStore } from '@/stores/authStore'

const router = useRouter()
const toast = useToast()
const authStore = useAuthStore()

const username = ref('')
const password = ref('')
const showPassword = ref(false) // 👁️ toggle password visibility
const focused = ref({ username: false, password: false })

const handleBlur = (field) => {
  if (!username.value && field === 'username') focused.value.username = false
  if (!password.value && field === 'password') focused.value.password = false
}

const toggleShowPassword = () => {
  showPassword.value = !showPassword.value
}

const handleSubmit = async () => {
  if (!username.value || !password.value) {
    toast.error('Vui lòng nhập tài khoản và mật khẩu!', { id: 'login-validation' })
    return
  }

  await authStore.login({
    userName: username.value,
    password: password.value,
  })

  if (authStore.error) {
    toast.error(authStore.error, {
      id: 'login-error-' + Date.now(), // ID để ép toast hiện lại
    })
    return
  }

  toast.success(authStore.message || 'Đăng nhập thành công!', { id: 'login-success' })
  router.push({ name: 'Home' })
}
</script>

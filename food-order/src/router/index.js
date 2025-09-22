import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import CategoryView from '@/views/CategoryView.vue'
import ComboView from '@/views/ComboView.vue'
import AboutUsView from '@/views/AboutUsView.vue'
import MenuView from '@/views/MenuView.vue'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import FoodDetailView from '@/views/FoodDetailView.vue'
import FoodInCategoryView from '@/views/FoodInCategoryView.vue'
import ComboDetailView from '@/views/ComboDetailView.vue'
import Test from '@/views/Test.vue'
import CartView from '@/views/CartView.vue'
import AccountView from '@/views/AccountView.vue'
import AccountInfo from '@/components/accountComponents/AccountInfo.vue'
import ChangePassword from '@/components/accountComponents/ChangePassword.vue'
import Location from '@/components/accountComponents/Location.vue'
import OrderList from '@/components/accountComponents/OrderList.vue'
import CheckoutView from '@/views/CheckoutView.vue'

import { useAuthStore } from '@/stores/authStore'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    // Nếu có saved position (như khi dùng back button), sử dụng nó
    if (savedPosition) {
      return savedPosition
    }
    // Luôn scroll về đầu trang khi chuyển route
    return { top: 0 }
  },
  routes: [
    {
      path: '/',
      name: 'Home',
      component: HomeView,
    },
    {
      path: '/categories',
      name: 'Category',
      component: CategoryView,
    },
    {
      path: '/combos',
      name: 'Combo',
      component: ComboView,
    },
    {
      path: '/about-us',
      name: 'AboutUs',
      component: AboutUsView,
    },
    {
      path: '/menu',
      name: 'Menu',
      component: MenuView,
    },
    {
      path: '/login',
      name: 'Login',
      component: LoginView,
    },
    {
      path: '/register',
      name: 'Register',
      component: RegisterView,
    },
    {
      path: '/categories/:categorySlug/food-detail/:foodSlug',
      name: 'FoodDetail',
      component: FoodDetailView,
      props: true,
    },
    {
      path: '/categories/:categorySlug/combo-detail/:comboSlug',
      name: 'ComboDetail',
      component: ComboDetailView,
      props: true,
    },
    //combo-2
    {
      path: '/menu/:comboSlug',
      name: 'ComboDetailNav',
      component: ComboDetailView,
      props: true,
    },
    {
      path: '/categories/:categorySlug',
      name: 'FoodInCategory',
      component: FoodInCategoryView,
      props: true,
    },

    {
      path: '/test',
      component: Test,
      props: true,
    },

    {
      path: '/cart',
      name: 'Cart',
      component: CartView,
      meta: { requiresAuth: true },
    },
    {
      path: '/checkout',
      name: 'Checkout',
      component: CheckoutView,
    },
    {
      path: '/checkout-success',
      name: 'CheckoutSuccess',
      component: () => import('@/views/CheckoutSuccess.vue'),
    },
    {
      path: '/checkout-failed',
      name: 'CheckoutFailed',
      component: () => import('@/views/CheckoutFailed.vue'),
    },
    {
      path: '/account',
      name: 'account',
      component: AccountView,
      meta: { requiresAuth: true },
      children: [
        { path: '', redirect: '/account/orders' },
        { path: 'info', component: AccountInfo },
        { path: 'orders', component: OrderList },
        { path: 'addresses', component: Location },
        { path: 'password', component: ChangePassword },
      ],
    },
    {
      path: '/logout',
      name: 'logout',
      beforeEnter: async (to, from, next) => {
        const authStore = useAuthStore()
        await authStore.logout()
        next('/login')
      },
    },
  ],
})

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)
  const token = localStorage.getItem('accessToken')

  if (requiresAuth && !token) {
    next({ path: '/login' })
  } else {
    next()
  }
})
export default router

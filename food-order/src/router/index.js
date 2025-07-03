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


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
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
  ],
})

export default router

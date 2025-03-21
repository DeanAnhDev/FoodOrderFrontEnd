import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import CategoryView from '@/views/CategoryView.vue'
import ComboView from '@/views/ComboView.vue'
import AboutUsView from '@/views/AboutUsView.vue'
import MenuView from '@/views/MenuView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: HomeView,
    },
    {
      path: '/Categorys',
      name: 'Category',
      component: CategoryView,
    },
    {
      path: '/Combos',
      name: 'Combo',
      component: ComboView,
    },
    {
      path: '/AboutUs',
      name: 'AboutUs',
      component: AboutUsView,
    },
    {
      path: '/Menu',
      name: 'Menu',
      component: MenuView,
    },
  ],
})

export default router

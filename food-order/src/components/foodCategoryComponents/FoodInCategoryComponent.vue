  <template>
    <section class="mb-10">
     

      <p v-if="foodsByCategorySlugStore.error || combosByCategorySlugStore.error" class="text-center text-red-500">
        {{ foodsByCategorySlugStore.error || combosByCategorySlugStore.error }}
      </p>

      <div v-if="categoryData" class="mt-5">
        <div class="flex items-center">
          <h1 class="text-primary font-title-menu-mobile font-bold uppercase text-xl sm:text-3xl p-3 sm:p-5 relative">
            {{ categoryData.categoryName || 'Danh mục không xác định' }}
          </h1>
          <div class="flex-grow h-0.5 bg-gray-300 mr-5"></div>
        </div>
        <FoodComponent :category="categoryData" />
      </div>
      
    </section>
  </template>

<script setup>
import { computed, onMounted } from 'vue'
import { useFoodsByCategorySlugStore, useCombosByCategorySlugStore } from '@/stores/categoryStore'
import { useRoute } from 'vue-router'
import FoodComponent from '@/components/foodComponents/FoodComponent.vue'


const route = useRoute()
const foodsByCategorySlugStore = useFoodsByCategorySlugStore()
const combosByCategorySlugStore = useCombosByCategorySlugStore()

const categoryData = computed(() => {
  const foods = foodsByCategorySlugStore.foodsByCategorySlug?.foods
  const combos = combosByCategorySlugStore.combosByCategorySlug?.combos

  if (Array.isArray(foods) && foods.length > 0) {
    return foodsByCategorySlugStore.foodsByCategorySlug
  } else if (Array.isArray(combos) && combos.length > 0) {
    return combosByCategorySlugStore.combosByCategorySlug
  }
  return null
})


onMounted(async () => {
  const categorySlug = route.params.categorySlug
  if (categorySlug) {
    await foodsByCategorySlugStore.fetchFoodsByCategorySlug(categorySlug)
    await combosByCategorySlugStore.fetchCombosByCategorySlug(categorySlug)

  

    
  }
})

</script>

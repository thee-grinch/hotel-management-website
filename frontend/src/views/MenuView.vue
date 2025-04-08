<script setup>
import { onMounted, ref } from 'vue'
import { useMenuStore } from '@/stores/menu'
import { useCartStore } from '@/stores/cart'
import MenuItemCard from '@/components/MenuItemCard.vue'

const menuStore = useMenuStore()
const cartStore = useCartStore()
const activeCategory = ref(null)

onMounted(async () => {
  await menuStore.fetchCategories()
  await menuStore.fetchMenuItems()
  
  if (menuStore.categories.length > 0) {
    activeCategory.value = menuStore.categories[0]._id
  }
})

const addToCart = (item) => {
  cartStore.addItem({
    menuItem: item._id,
    name: item.name,
    price: item.price,
    quantity: 1
  })
}
</script>

<template>
  <div class="py-8">
    <h1 class="text-3xl font-bold text-gray-900 mb-8">Our Menu</h1>
    
    <!-- Category tabs -->
    <div class="flex overflow-x-auto pb-2 mb-6 scrollbar-hide">
      <button
        v-for="category in menuStore.categories"
        :key="category._id"
        @click="activeCategory = category._id"
        :class="[
          'px-4 py-2 mr-2 rounded-full font-medium whitespace-nowrap',
          activeCategory === category._id
            ? 'bg-indigo-600 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        ]"
      >
        {{ category.name }}
      </button>
    </div>
    
    <!-- Loading state -->
    <div v-if="menuStore.loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="i in 6" :key="i" class="bg-gray-100 rounded-lg h-64 animate-pulse"></div>
    </div>
    
    <!-- Menu items -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <MenuItemCard
        v-for="item in menuStore.getItemsByCategory(activeCategory)"
        :key="item._id"
        :item="item"
        @add-to-cart="addToCart"
      />
    </div>
    
    <!-- Error state -->
    <div v-if="menuStore.error" class="text-red-500 mt-4">
      {{ menuStore.error }}
    </div>
  </div>
</template>
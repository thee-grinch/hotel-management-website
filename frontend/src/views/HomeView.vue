<script setup>
import { useMenuStore } from '@/stores/menu'

const menuStore = useMenuStore()
</script>

<template>
  <div class="py-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">Welcome to Our Restaurant</h1>
        <p class="text-xl text-gray-600 mb-8">Experience the finest dining in town</p>
        
        <div class="flex justify-center gap-4">
          <RouterLink to="/menu"
            class="bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700">
            View Menu
          </RouterLink>
          <RouterLink to="/reservation"
            class="bg-white text-indigo-600 px-8 py-3 rounded-lg border-2 border-indigo-600 hover:bg-indigo-50">
            Book Table
          </RouterLink>
        </div>
      </div>

      <div class="mt-16">
        <h2 class="text-2xl font-bold mb-8">Featured Items</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- Featured items would be implemented similarly to menu items -->
        </div>
      </div>
    </div>
  </div>
</template>
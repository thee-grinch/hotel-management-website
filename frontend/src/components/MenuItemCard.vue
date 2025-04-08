<script setup>
defineProps({
  item: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['add-to-cart'])
</script>

<template>
  <div class="bg-white rounded-lg shadow overflow-hidden">
    <div class="h-48 bg-gray-200 overflow-hidden">
      <img 
        v-if="item.image" 
        :src="item.image" 
        :alt="item.name" 
        class="w-full h-full object-cover"
      >
      <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
        <span>No image</span>
      </div>
    </div>
    <div class="p-4">
      <div class="flex justify-between items-start">
        <h3 class="text-lg font-medium text-gray-900">{{ item.name }}</h3>
        <span class="text-lg font-medium text-indigo-600">${{ item.price.toFixed(2) }}</span>
      </div>
      <p class="mt-1 text-sm text-gray-500">{{ item.description }}</p>
      <button
        @click="emit('add-to-cart', item)"
        class="mt-4 w-full bg-indigo-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Add to Cart
      </button>
    </div>
  </div>
</template>
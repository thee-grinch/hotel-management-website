<!-- <script setup>
import { RouterView } from 'vue-router'
import AdminSidebar from '@/components/admin/AdminSidebar.vue'
</script>

<template>
  <div class="flex min-h-screen">
    <AdminSidebar />
    
    <div class="flex-1">
      <div class="container mx-auto px-4 py-8">
        <RouterView />
      </div>
    </div>
  </div>
</template> -->
<script setup>
import { ref } from 'vue'
import axios from '@/axios'

const stats = ref({
  totalOrders: 0,
  pendingOrders: 0,
  availableTables: 0,
  totalRevenue: 0
})

const loading = ref(true)

const fetchStats = async () => {
  try {
    const response = await axios.get('/api/admin/stats')
    stats.value = response.data
  } finally {
    loading.value = false
  }
}

fetchStats()
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">Admin Dashboard</h1>
    
    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div v-for="i in 4" :key="i" class="bg-gray-100 rounded-lg h-32 animate-pulse"></div>
    </div>
    
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="bg-white p-6 rounded-lg shadow">
        <h3 class="text-lg font-medium text-gray-500">Total Orders</h3>
        <p class="text-3xl font-bold mt-2">{{ stats.totalOrders }}</p>
      </div>
      
      <div class="bg-white p-6 rounded-lg shadow">
        <h3 class="text-lg font-medium text-gray-500">Pending Orders</h3>
        <p class="text-3xl font-bold mt-2">{{ stats.pendingOrders }}</p>
      </div>
      
      <div class="bg-white p-6 rounded-lg shadow">
        <h3 class="text-lg font-medium text-gray-500">Available Tables</h3>
        <p class="text-3xl font-bold mt-2">{{ stats.availableTables }}</p>
      </div>
      
      <div class="bg-white p-6 rounded-lg shadow">
        <h3 class="text-lg font-medium text-gray-500">Total Revenue</h3>
        <p class="text-3xl font-bold mt-2">${{ stats.totalRevenue.toFixed(2) }}</p>
      </div>
    </div>
  </div>
</template>
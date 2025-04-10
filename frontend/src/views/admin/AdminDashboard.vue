<script setup>
import AdminSidebar from '@/components/admin/AdminSidebar.vue'
import { ref, onMounted } from 'vue'
import axios from '@/axios'
import {
  ChartBarIcon,
  CurrencyDollarIcon,
  ShoppingBagIcon,
  UserGroupIcon
} from '@heroicons/vue/24/outline'

const stats = ref({
  totalOrders: 0,
  totalRevenue: 0,
  activeUsers: 0,
  menuItems: 0,
  recentOrders: [],
  popularItems: []
})

const loading = ref(true)
const error = ref('')

const fetchStats = async () => {
  try {
    loading.value = true
    const response = await axios.get('/api/admin/stats')
    stats.value = response.data
  } catch (err) {
    error.value = err.response?.data?.msg || 'Failed to fetch dashboard statistics'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchStats()
})
</script>

<template>
  <div class="flex">
    <!-- Admin Sidebar -->
    <AdminSidebar />

    <!-- Main Content -->
    <div class="flex-1 p-6">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>

      <!-- Error Message -->
      <div v-if="error" class="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
        <div class="flex">
          <div class="ml-3">
            <p class="text-sm text-red-700">{{ error }}</p>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div v-for="i in 4" :key="i" class="bg-gray-100 rounded-lg h-32 animate-pulse"></div>
      </div>

      <!-- Dashboard Stats -->
      <div v-else class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                <ShoppingBagIcon class="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <div class="ml-5 w-0 flex-1">
                <dt class="text-sm font-medium text-gray-500 truncate">Total Orders</dt>
                <dd class="flex items-baseline">
                  <div class="text-2xl font-semibold text-gray-900">
                    {{ stats.totalOrders }}
                  </div>
                </dd>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0 bg-green-500 rounded-md p-3">
                <CurrencyDollarIcon class="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <div class="ml-5 w-0 flex-1">
                <dt class="text-sm font-medium text-gray-500 truncate">Total Revenue</dt>
                <dd class="flex items-baseline">
                  <div class="text-2xl font-semibold text-gray-900">
                    ${{ stats.totalRevenue.toFixed(2) }}
                  </div>
                </dd>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0 bg-blue-500 rounded-md p-3">
                <UserGroupIcon class="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <div class="ml-5 w-0 flex-1">
                <dt class="text-sm font-medium text-gray-500 truncate">Active Users</dt>
                <dd class="flex items-baseline">
                  <div class="text-2xl font-semibold text-gray-900">
                    {{ stats.activeUsers }}
                  </div>
                </dd>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0 bg-purple-500 rounded-md p-3">
                <ChartBarIcon class="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <div class="ml-5 w-0 flex-1">
                <dt class="text-sm font-medium text-gray-500 truncate">Menu Items</dt>
                <dd class="flex items-baseline">
                  <div class="text-2xl font-semibold text-gray-900">
                    {{ stats.menuItems }}
                  </div>
                </dd>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Router View for Child Routes -->
      <div class="p-2"><router-view /></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from '@/axios'
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'
import { EllipsisVerticalIcon, ArrowPathIcon } from '@heroicons/vue/20/solid'

const orders = ref([])
const loading = ref(false)
const error = ref(null)
const statusOptions = ['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled']

const fetchOrders = async () => {
  try {
    loading.value = true
    const response = await axios.get('/api/orders')
    orders.value = response.data
  } catch (err) {
    error.value = err.response?.data?.msg || 'Failed to fetch orders'
  } finally {
    loading.value = false
  }
}

const updateOrderStatus = async (orderId, newStatus) => {
  try {
    await axios.put(`/api/orders/${orderId}/status`, { status: newStatus })
    await fetchOrders()
  } catch (err) {
    error.value = err.response?.data?.msg || 'Failed to update order status'
  }
}

onMounted(() => {
  fetchOrders()
})
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Order Management</h1>
      <button 
        @click="fetchOrders"
        class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        <ArrowPathIcon class="-ml-0.5 mr-2 h-4 w-4" aria-hidden="true" />
        Refresh
      </button>
    </div>
    
    <div v-if="error" class="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
      <div class="flex">
        <div class="flex-shrink-0">
          <XCircleIcon class="h-5 w-5 text-red-400" aria-hidden="true" />
        </div>
        <div class="ml-3">
          <p class="text-sm text-red-700">{{ error }}</p>
        </div>
      </div>
    </div>
    
    <div v-if="loading" class="space-y-4">
      <div v-for="i in 3" :key="i" class="bg-gray-100 rounded-lg h-20 animate-pulse"></div>
    </div>
    
    <div v-else class="bg-white shadow overflow-hidden sm:rounded-md">
      <ul class="divide-y divide-gray-200">
        <li v-for="order in orders" :key="order._id">
          <div class="px-4 py-4 sm:px-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-indigo-600 truncate">
                  Order #{{ order._id.substring(18) }}
                </p>
                <div class="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:mt-0 sm:space-x-6">
                  <div class="mt-2 flex items-center text-sm text-gray-500">
                    <UserIcon class="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" aria-hidden="true" />
                    {{ order.user.name }}
                  </div>
                  <div class="mt-2 flex items-center text-sm text-gray-500">
                    <CalendarIcon class="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" aria-hidden="true" />
                    {{ new Date(order.createdAt).toLocaleString() }}
                  </div>
                  <div class="mt-2 flex items-center text-sm text-gray-500">
                    <CurrencyDollarIcon class="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" aria-hidden="true" />
                    ${{ order.totalAmount.toFixed(2) }}
                  </div>
                  <div class="mt-2 flex items-center text-sm text-gray-500">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" 
                      :class="{
                        'bg-yellow-100 text-yellow-800': order.status === 'pending',
                        'bg-blue-100 text-blue-800': order.status === 'confirmed',
                        'bg-purple-100 text-purple-800': order.status === 'preparing',
                        'bg-green-100 text-green-800': order.status === 'ready',
                        'bg-indigo-100 text-indigo-800': order.status === 'delivered',
                        'bg-red-100 text-red-800': order.status === 'cancelled'
                      }"
                    >
                      {{ order.status }}
                    </span>
                  </div>
                </div>
              </div>
              <Menu as="div" class="relative ml-4 flex-shrink-0">
                <div>
                  <MenuButton class="bg-white rounded-full flex text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    <span class="sr-only">Open options</span>
                    <EllipsisVerticalIcon class="h-5 w-5" aria-hidden="true" />
                  </MenuButton>
                </div>
                <transition
                  enter-active-class="transition ease-out duration-100"
                  enter-from-class="transform opacity-0 scale-95"
                  enter-to-class="transform opacity-100 scale-100"
                  leave-active-class="transition ease-in duration-75"
                  leave-from-class="transform opacity-100 scale-100"
                  leave-to-class="transform opacity-0 scale-95"
                >
                  <MenuItems class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 py-1 focus:outline-none z-10">
                    <MenuItem v-for="status in statusOptions" :key="status" v-slot="{ active }">
                      <button
                        @click="updateOrderStatus(order._id, status)"
                        :class="[active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700 w-full text-left']"
                        :disabled="order.status === status"
                      >
                        Mark as {{ status }}
                      </button>
                    </MenuItem>
                  </MenuItems>
                </transition>
              </Menu>
            </div>
            <div class="mt-4">
              <h3 class="text-sm font-medium text-gray-900">Items</h3>
              <ul class="mt-2 border border-gray-200 rounded-md divide-y divide-gray-200">
                <li v-for="item in order.items" :key="item._id" class="py-3 px-4 flex justify-between">
                  <div class="flex">
                    <span class="font-medium text-gray-900">{{ item.quantity }}x</span>
                    <span class="ml-2 text-gray-700">{{ item.menuItem.name }}</span>
                  </div>
                  <span class="text-gray-700">${{ (item.priceAtOrder * item.quantity).toFixed(2) }}</span>
                </li>
              </ul>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import axios from '@/axios'
import { useAuthStore } from '@/stores/auth'
import OrderStatusBadge from '@/components/OrderStatusBadge.vue'

const authStore = useAuthStore()
const orders = ref([])
const loading = ref(false)
const error = ref('')

const fetchOrders = async () => {
  try {
    loading.value = true
    const response = await axios.get('/api/orders')
    orders.value = response.data
  } catch (err) {
    error.value = err.response?.data?.msg || 'Failed to load orders'
  } finally {
    loading.value = false
  }
}

onMounted(fetchOrders)
</script>

<template>
  <div class="max-w-4xl mx-auto py-8">
    <h1 class="text-2xl font-bold mb-6">My Orders</h1>

    <div v-if="error" class="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
      {{ error }}
    </div>

    <div v-if="loading" class="space-y-4">
      <div v-for="i in 3" :key="i" class="h-24 bg-gray-100 rounded-md animate-pulse"></div>
    </div>

    <div v-else class="space-y-4">
      <div v-for="order in orders" :key="order._id" class="bg-white p-6 rounded-lg shadow">
        <div class="flex justify-between items-start mb-4">
          <div>
            <p class="font-medium">Order #{{ order._id.substring(18) }}</p>
            <p class="text-sm text-gray-500">
              {{ new Date(order.createdAt).toLocaleDateString() }}
            </p>
          </div>
          <OrderStatusBadge :status="order.status" />
        </div>

        <div class="border-t pt-4">
          <div v-for="item in order.items" :key="item._id" class="flex justify-between py-2">
            <div class="flex items-center">
              <span class="text-gray-500 mr-2">{{ item.quantity }}x</span>
              <span>{{ item.menuItem.name }}</span>
            </div>
            <span>${{ (item.priceAtOrder * item.quantity).toFixed(2) }}</span>
          </div>
          
          <div class="flex justify-between pt-4 mt-4 border-t">
            <span class="font-medium">Total</span>
            <span class="font-medium">${{ order.totalAmount.toFixed(2) }}</span>
          </div>
        </div>
      </div>

      <p v-if="!orders.length" class="text-center text-gray-500">
        No orders found
      </p>
    </div>
  </div>
</template>
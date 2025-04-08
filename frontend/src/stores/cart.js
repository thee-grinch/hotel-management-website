import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from '@/axios'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

export const useCartStore = defineStore('cart', () => {
  const items = ref([])
  const orderType = ref('dine-in') // 'dine-in' or 'takeaway'
  const selectedTable = ref(null)
  const loading = ref(false)
  
  const router = useRouter()
  const authStore = useAuthStore()

  // Total price of all items in cart
  const total = computed(() => {
    return items.value.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  })

  // Add item to cart
  const addItem = (item) => {
    const existingItem = items.value.find(i => i.menuItem === item.menuItem)
    
    if (existingItem) {
      existingItem.quantity += item.quantity
    } else {
      items.value.push({ ...item })
    }
  }

  // Remove item from cart
  const removeItem = (itemId) => {
    items.value = items.value.filter(item => item.menuItem !== itemId)
  }

  // Update item quantity
  const updateQuantity = (itemId, quantity) => {
    const item = items.value.find(i => i.menuItem === itemId)
    if (item) {
      item.quantity = quantity
    }
  }

  // Clear cart
  const clearCart = () => {
    items.value = []
    selectedTable.value = null
  }

  // Submit order
  const submitOrder = async () => {
    if (!authStore.isAuthenticated) {
      router.push({ name: 'login', query: { redirect: '/cart' } })
      return { success: false, error: 'Please login to place an order' }
    }

    if (items.value.length === 0) {
      return { success: false, error: 'Your cart is empty' }
    }

    if (orderType.value === 'dine-in' && !selectedTable.value) {
      return { success: false, error: 'Please select a table for dine-in' }
    }

    try {
      loading.value = true
      
      const orderData = {
        items: items.value.map(item => ({
          menuItem: item.menuItem,
          quantity: item.quantity,
          specialInstructions: item.specialInstructions || ''
        })),
        orderType: orderType.value,
        tableId: orderType.value === 'dine-in' ? selectedTable.value._id : null
      }

      await axios.post('/api/orders', orderData)
      clearCart()
      
      return { success: true }
    } catch (error) {
      console.error('Order submission failed:', error)
      return { 
        success: false, 
        error: error.response?.data?.msg || 'Failed to place order' 
      }
    } finally {
      loading.value = false
    }
  }

  return {
    items,
    orderType,
    selectedTable,
    loading,
    total,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    submitOrder
  }
})
import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from '@/axios'

export const useMenuStore = defineStore('menu', () => {
  const categories = ref([])
  const menuItems = ref([])
  const loading = ref(false)
  const error = ref(null)

  // Fetch all categories
  const fetchCategories = async () => {
    try {
      loading.value = true
      const response = await axios.get('/api/menu/categories')
      categories.value = response.data
    } catch (err) {
      error.value = err.response?.data?.msg || 'Failed to fetch categories'
    } finally {
      loading.value = false
    }
  }

  // Fetch all menu items
  const fetchMenuItems = async () => {
    try {
      loading.value = true
      const response = await axios.get('/api/menu/items')
      menuItems.value = response.data
    } catch (err) {
      error.value = err.response?.data?.msg || 'Failed to fetch menu items'
    } finally {
      loading.value = false
    }
  }

  // Get menu items by category
  const getItemsByCategory = (categoryId) => {
    return menuItems.value.filter(item => item.category._id === categoryId)
  }

  return {
    categories,
    menuItems,
    loading,
    error,
    fetchCategories,
    fetchMenuItems,
    getItemsByCategory
  }
})
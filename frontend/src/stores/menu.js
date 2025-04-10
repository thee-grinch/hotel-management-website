import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from '@/axios'

export const useMenuStore = defineStore('menu', () => {
  const categories = ref([])
  const menuItems = ref([])
  const loading = ref(false)
  const error = ref(null)
  const featuredItems = ref([
    {
      id: 1,
      name: 'Fines Tartare Steak',
      description: 'A delicious tartare steak prepared with the finest ingredients.',
      price: 50,
      image: '/images/featured-1.png', // Corrected path
    },
    {
      id: 2,
      name: 'Creamy Chicken Soup',
      description: 'A rich and creamy chicken soup with a hint of herbs.',
      price: 60,
      image: '/images/featured-2.png', // Corrected path
    },
    {
      id: 3,
      name: 'Best Roasted Rumsteak',
      description: 'Perfectly roasted rumsteak served with seasonal vegetables.',
      price: 150,
      image: '/images/featured-3.png', // Corrected path
    },
  ])

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
    featuredItems,
    fetchCategories,
    fetchMenuItems,
    getItemsByCategory
  }
})
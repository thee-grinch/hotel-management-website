import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from '@/axios'
import router from '@/router'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref(localStorage.getItem('token'))
  const isAuthenticated = computed(() => !!token.value)

  // Set authentication token
  const setToken = (newToken) => {
    token.value = newToken
    localStorage.setItem('token', newToken)
    axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`
  }

  // Remove authentication token
  const removeToken = () => {
    token.value = null
    localStorage.removeItem('token')
    delete axios.defaults.headers.common['Authorization']
  }

  // Login user
  const login = async (credentials) => {
    try {
      const response = await axios.post('/api/auth/login', credentials)
      setToken(response.data.token)
      await fetchUser()
      return { success: true }
    } catch (error) {
      removeToken()
      return { success: false, error: error.response?.data?.msg || 'Login failed' }
    }
  }

  // Register user
  const register = async (userData) => {
    try {
      const response = await axios.post('/api/auth/register', userData)
      setToken(response.data.token)
      await fetchUser()
      return { success: true }
    } catch (error) {
      removeToken()
      return { success: false, error: error.response?.data?.msg || 'Registration failed' }
    }
  }

  // Fetch current user
  const fetchUser = async () => {
    try {
      const response = await axios.get('/api/auth/me')
      user.value = response.data
    } catch (error) {
      user.value = null
      throw error
    }
  }

  // Logout user
  const logout = async () => {
    removeToken()
    user.value = null
    router.push('/login')
  }

  // Initialize authentication
  const init = async () => {
    if (token.value) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token.value}`
      try {
        await fetchUser()
      } catch (error) {
        removeToken()
      }
    }
  }

  return {
    user,
    token,
    isAuthenticated,
    setToken,
    removeToken,
    login,
    register,
    fetchUser,
    logout,
    init
  }
})
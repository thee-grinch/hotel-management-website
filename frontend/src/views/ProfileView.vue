<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const form = ref({ ...authStore.user })
const error = ref('')
const success = ref('')
const loading = ref(false)

const handleSubmit = async () => {
  try {
    loading.value = true
    const response = await axios.put(`/api/users/${authStore.user._id}`, form.value)
    authStore.user = response.data
    success.value = 'Profile updated successfully'
    setTimeout(() => success.value = '', 3000)
  } catch (err) {
    error.value = err.response?.data?.msg || 'Failed to update profile'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="max-w-2xl mx-auto py-8">
    <h1 class="text-2xl font-bold mb-6">My Profile</h1>
    
    <div v-if="success" class="mb-4 p-4 bg-green-100 text-green-700 rounded-md">
      {{ success }}
    </div>
    
    <div v-if="error" class="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
      {{ error }}
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-6">
      <div>
        <label class="block text-sm font-medium text-gray-700">Name</label>
        <input v-model="form.name" required
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">Email</label>
        <input v-model="form.email" type="email" required
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">Phone</label>
        <input v-model="form.phone"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">Address</label>
        <textarea v-model="form.address" rows="3"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"></textarea>
      </div>

      <div>
        <button :disabled="loading"
          class="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:opacity-50">
          {{ loading ? 'Saving...' : 'Save Changes' }}
        </button>
      </div>
    </form>
  </div>
</template>
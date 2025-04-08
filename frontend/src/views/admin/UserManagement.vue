<script setup>
import { ref, onMounted } from 'vue'
import axios from '@/axios'
import { UserIcon, PencilIcon, TrashIcon } from '@heroicons/vue/24/outline'

const users = ref([])
const loading = ref(false)
const error = ref('')

const fetchUsers = async () => {
  try {
    loading.value = true
    const response = await axios.get('/api/users')
    users.value = response.data
  } catch (err) {
    error.value = err.response?.data?.msg || 'Failed to load users'
  } finally {
    loading.value = false
  }
}

const updateUserRole = async (userId, newRole) => {
  try {
    await axios.put(`/api/users/${userId}/role`, { role: newRole })
    fetchUsers()
  } catch (err) {
    error.value = err.response?.data?.msg || 'Failed to update role'
  }
}

const deleteUser = async (userId) => {
  if (!confirm('Are you sure you want to delete this user?')) return
  try {
    await axios.delete(`/api/users/${userId}`)
    fetchUsers()
  } catch (err) {
    error.value = err.response?.data?.msg || 'Failed to delete user'
  }
}

onMounted(fetchUsers)
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">User Management</h1>

    <div v-if="error" class="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
      {{ error }}
    </div>

    <div class="bg-white shadow overflow-hidden rounded-lg">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500">User</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500">Email</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500">Role</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="user in users" :key="user._id">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <UserIcon class="h-5 w-5 text-gray-400 mr-2" />
                {{ user.name }}
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">{{ user.email }}</td>
            <td class="px-6 py-4 whitespace-nowrap">
              <select :value="user.role" @change="updateUserRole(user._id, $event.target.value)"
                class="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
                <option value="customer">Customer</option>
                <option value="staff">Staff</option>
                <option value="admin">Admin</option>
              </select>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <button @click="deleteUser(user._id)"
                class="text-red-600 hover:text-red-900 p-1 rounded-full">
                <TrashIcon class="h-5 w-5" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
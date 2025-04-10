<script setup>
import { ref, onMounted } from 'vue'
import axios from '@/axios'
import { PlusIcon, PencilIcon, TrashIcon, XCircleIcon } from '@heroicons/vue/20/solid'
import AddEditTableDialog from '@/components/admin/AddEditTableDialog.vue'

const tables = ref([])
const loading = ref(false)
const error = ref('')
const showDialog = ref(false)
const currentTable = ref(null)

const fetchTables = async () => {
  try {
    loading.value = true
    const response = await axios.get('/api/tables')
    tables.value = response.data
  } catch (err) {
    error.value = err.response?.data?.msg || 'Failed to fetch tables'
  } finally {
    loading.value = false
  }
}

const handleAdd = () => {
  currentTable.value = null // Reset the current table
  showDialog.value = true // Show the dialog
}

const handleEdit = (table) => {
  currentTable.value = table // Set the current table for editing
  showDialog.value = true // Show the dialog
}

const handleDelete = async (id) => {
  if (!confirm('Are you sure you want to delete this table?')) return

  try {
    await axios.delete(`/api/tables/${id}`)
    await fetchTables()
  } catch (err) {
    error.value = err.response?.data?.msg || 'Failed to delete table'
  }
}

const handleDialogClose = (refresh = false) => {
  showDialog.value = false
  currentTable.value = null
  if (refresh) fetchTables()
}

onMounted(() => {
  fetchTables()
})
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Table Management</h1>
      <button
        @click="handleAdd"
        class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        <PlusIcon class="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
        Add Table
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
      <div v-for="i in 5" :key="i" class="bg-gray-100 rounded-lg h-20 animate-pulse"></div>
    </div>

    <div v-else class="bg-white shadow overflow-hidden sm:rounded-md">
      <ul class="divide-y divide-gray-200">
        <li v-for="table in tables" :key="table._id">
          <div class="px-4 py-4 sm:px-6">
            <div class="flex items-center justify-between">
              <div>
                <div class="text-lg font-medium text-indigo-600">Table {{ table.number }}</div>
                <div class="mt-1 text-sm text-gray-500">
                  Capacity: {{ table.capacity }} people
                  <span v-if="table.location"> • {{ table.location }}</span>
                </div>
                <div class="mt-1">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" 
                    :class="table.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                  >
                    {{ table.isAvailable ? 'Available' : 'Occupied' }}
                  </span>
                </div>
              </div>
              <div class="flex space-x-2">
                <button
                  @click="handleEdit(table)"
                  class="p-1 rounded-full text-indigo-600 hover:text-indigo-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <PencilIcon class="h-5 w-5" aria-hidden="true" />
                </button>
                <button
                  @click="handleDelete(table._id)"
                  class="p-1 rounded-full text-red-600 hover:text-red-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <TrashIcon class="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>

    <AddEditTableDialog
      :show="showDialog"
      :table="currentTable"
      @close="handleDialogClose"
    />
  </div>
</template>
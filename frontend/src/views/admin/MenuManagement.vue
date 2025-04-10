<script setup>
import { ref, onMounted } from 'vue'
import axios from '@/axios'
import { PlusIcon, PencilIcon, TrashIcon, XCircleIcon } from '@heroicons/vue/20/solid'
import AddEditMenuItemDialog from '@/components/admin/AddEditMenuItemDialog.vue'
import ManageCategoriesDialog from '@/components/admin/ManageCategoriesDialog.vue'

const menuItems = ref([])
const categories = ref([])
const loading = ref(false)
const error = ref('')
const showDialog = ref(false)
const showCategoriesDialog = ref(false)
const currentItem = ref(null)

const fetchMenuItems = async () => {
  try {
    loading.value = true
    const [itemsRes, catsRes] = await Promise.all([
      axios.get('/api/menu/items'),
      axios.get('/api/menu/categories')
    ])
    menuItems.value = itemsRes.data
    categories.value = catsRes.data
    console.log(categories.value)
  } catch (err) {
    error.value = err.response?.data?.msg || 'Failed to fetch menu items'
  } finally {
    loading.value = false
  }
}

const handleAdd = () => {
  currentItem.value = null // Reset the current menu item
  showDialog.value = true // Show the dialog
}

const handleEdit = (item) => {
  currentItem.value = item // Set the current menu item for editing
  showDialog.value = true // Show the dialog
}

const handleDelete = async (id) => {
  if (!confirm('Are you sure you want to delete this menu item?')) return

  try {
    await axios.delete(`/api/menu/items/${id}`)
    await fetchMenuItems()
  } catch (err) {
    error.value = err.response?.data?.msg || 'Failed to delete menu item'
  }
}

const handleDialogClose = (refresh = false) => {
  showDialog.value = false
  currentItem.value = null
  if (refresh) fetchMenuItems()
}

const handleCategoriesDialogClose = (refresh = false) => {
  showCategoriesDialog.value = false
  if (refresh) fetchMenuItems()
}

onMounted(() => {
  fetchMenuItems()
})
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Menu Management</h1>
      <div class="flex space-x-4">
        <button
          @click="showCategoriesDialog = true"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          Manage Categories
        </button>
        <button
          @click="handleAdd"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <PlusIcon class="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
          Add Menu Item
        </button>
      </div>
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
        <li v-for="item in menuItems" :key="item._id">
          <div class="px-4 py-4 sm:px-6">
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <div class="flex-shrink-0 h-16 w-16 bg-gray-200 rounded-md overflow-hidden">
                  <img 
                    v-if="item.image" 
                    :src="item.image" 
                    :alt="item.name" 
                    class="h-full w-full object-cover"
                  >
                  <div v-else class="h-full w-full bg-gray-200 flex items-center justify-center">
                    <span class="text-gray-400 text-xs">No image</span>
                  </div>
                </div>
                <div class="ml-4">
                  <div class="text-sm font-medium text-indigo-600">{{ item.name }}</div>
                  <div class="text-sm text-gray-500">{{ item.category.name }}</div>
                  <div class="mt-1 text-sm text-gray-500 line-clamp-2">{{ item.description }}</div>
                </div>
              </div>
              <div class="ml-4 flex-shrink-0 flex">
                <div class="mr-4 text-right">
                  <p class="text-lg font-medium text-gray-900">${{ item.price.toFixed(2) }}</p>
                  <p class="text-sm text-gray-500">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" 
                      :class="item.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                    >
                      {{ item.isAvailable ? 'Available' : 'Unavailable' }}
                    </span>
                  </p>
                </div>
                <div class="flex space-x-2">
                  <button
                    @click="handleEdit(item)"
                    class="p-1 rounded-full text-indigo-600 hover:text-indigo-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <PencilIcon class="h-5 w-5" aria-hidden="true" />
                  </button>
                  <button
                    @click="handleDelete(item._id)"
                    class="p-1 rounded-full text-red-600 hover:text-red-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <TrashIcon class="h-5 w-5" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>

    <AddEditMenuItemDialog
      :show="showDialog"
      :item="currentItem"
      :categories="categories"
      @close="handleDialogClose"
    />

    <ManageCategoriesDialog
      :show="showCategoriesDialog"
      @close="handleCategoriesDialogClose"
    />
  </div>
</template>
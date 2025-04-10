<script setup>
import { ref, watch } from 'vue'
import { Dialog, TransitionRoot, TransitionChild, DialogPanel, DialogTitle } from '@headlessui/vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'
import axios from '@/axios'

const props = defineProps({
  show: Boolean,
})

const emit = defineEmits(['close'])

const categories = ref([])
const newCategory = ref('')
const loading = ref(false)
const error = ref('')

watch(
  () => props.show,
  async (val) => {
    if (val) {
      await fetchCategories()
    }
  }
)

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

const addCategory = async () => {
  if (!newCategory.value.trim()) return
  try {
    loading.value = true
    await axios.post('/api/menu/categories', { name: newCategory.value })
    newCategory.value = ''
    await fetchCategories()
  } catch (err) {
    error.value = err.response?.data?.msg || 'Failed to add category'
  } finally {
    loading.value = false
  }
}

const deleteCategory = async (id) => {
  if (!confirm('Are you sure you want to delete this category?')) return
  try {
    loading.value = true
    await axios.delete(`/api/menu/categories/${id}`)
    await fetchCategories()
  } catch (err) {
    error.value = err.response?.data?.msg || 'Failed to delete category'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <TransitionRoot as="template" :show="show">
    <Dialog as="div" class="relative z-10" @close="emit('close')">
      <TransitionChild
        as="template"
        enter="ease-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
      </TransitionChild>

      <div class="fixed inset-0 z-10 overflow-y-auto">
        <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <TransitionChild
            as="template"
            enter="ease-out duration-300"
            enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leave-from="opacity-100 translate-y-0 sm:scale-100"
            leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <DialogPanel
              class="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6"
            >
              <div class="absolute top-0 right-0 hidden pt-4 pr-4 sm:block">
                <button
                  type="button"
                  class="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  @click="emit('close')"
                >
                  <span class="sr-only">Close</span>
                  <XMarkIcon class="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              <div>
                <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900">
                  Manage Categories
                </DialogTitle>

                <div class="mt-4">
                  <div v-if="error" class="text-red-500 text-sm mb-4">{{ error }}</div>

                  <div class="flex items-center space-x-4 mb-4">
                    <input
                      v-model="newCategory"
                      type="text"
                      placeholder="New category name"
                      class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                    <button
                      @click="addCategory"
                      :disabled="loading"
                      class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                      Add
                    </button>
                  </div>

                  <ul class="divide-y divide-gray-200">
                    <li v-for="category in categories" :key="category._id" class="flex justify-between items-center py-2">
                      <span class="text-sm font-medium text-gray-900">{{ category.name }}</span>
                      <button
                        @click="deleteCategory(category._id)"
                        :disabled="loading"
                        class="text-red-600 hover:text-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                      >
                        Delete
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
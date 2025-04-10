<!-- src/components/admin/AddEditMenuItemDialog.vue -->
<script setup>
import { ref, watch } from 'vue'
import { Dialog, TransitionRoot, TransitionChild, DialogPanel, DialogTitle } from '@headlessui/vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'
import axios from '@/axios'

const props = defineProps({
  show: Boolean,
  item: Object,
  categories: Array,
})

const emit = defineEmits(['close'])

const form = ref({
  name: '',
  description: '',
  price: 0,
  category: '',
  isAvailable: true,
  image: null,
})

const loading = ref(false)
const error = ref('')

watch(
  () => props.show,
  (val) => {
    if (val) {
      if (props.item) {
        form.value = {
          name: props.item.name,
          description: props.item.description,
          price: props.item.price,
          category: props.item.category?._id || '',
          isAvailable: props.item.isAvailable,
          image: null,
        }
      } else {
        resetForm()
      }
    }
  }
)

const resetForm = () => {
  form.value = {
    name: '',
    description: '',
    price: 0,
    category: '',
    isAvailable: true,
    image: null,
  }
}

const handleImageUpload = (event) => {
  form.value.image = event.target.files[0]
}

const handleSubmit = async () => {
  try {
    loading.value = true
    error.value = ''

    const formData = new FormData()
    formData.append('name', form.value.name)
    formData.append('description', form.value.description)
    formData.append('price', form.value.price)
    formData.append('category', form.value.category)
    formData.append('isAvailable', form.value.isAvailable)
    if (form.value.image) {
      formData.append('image', form.value.image)
    }

    if (props.item) {
      await axios.put(`/api/menu/items/${props.item._id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
    } else {
      await axios.post('/api/menu/items', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
    }

    emit('close', true)
  } catch (err) {
    error.value = err.response?.data?.msg || 'Failed to save menu item'
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
              <div class="sm:flex sm:items-start">
                <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                  <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900">
                    {{ item ? 'Edit Menu Item' : 'Add New Menu Item' }}
                  </DialogTitle>

                  <div class="mt-4 space-y-4">
                    <div v-if="error" class="text-red-500 text-sm">{{ error }}</div>

                    <div>
                      <label class="block text-sm font-medium text-gray-700">Name</label>
                      <input
                        v-model="form.name"
                        type="text"
                        required
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>

                    <div>
                      <label class="block text-sm font-medium text-gray-700">Description</label>
                      <textarea
                        v-model="form.description"
                        rows="3"
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      ></textarea>
                    </div>

                    <div>
                      <label class="block text-sm font-medium text-gray-700">Price</label>
                      <input
                        v-model.number="form.price"
                        type="number"
                        min="0"
                        step="0.01"
                        required
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>

                    <div>
                      <label class="block text-sm font-medium text-gray-700">Category</label>
                      <select
                        v-model="form.category"
                        required
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      >
                        <option value="" disabled>Select a category</option>
                        <option v-for="category in categories" :key="category._id" :value="category._id">
                          {{ category.name }}
                        </option>
                      </select>
                    </div>

                    <div>
                      <label class="block text-sm font-medium text-gray-700">Image</label>
                      <input
                        type="file"
                        accept="image/*"
                        @change="handleImageUpload"
                        class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                      />
                    </div>

                    <div class="flex items-center">
                      <input
                        id="is-available"
                        v-model="form.isAvailable"
                        type="checkbox"
                        class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <label for="is-available" class="ml-2 block text-sm text-gray-900">
                        Available
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  :disabled="loading"
                  @click="handleSubmit"
                  class="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                >
                  <span v-if="loading">Saving...</span>
                  <span v-else>{{ item ? 'Save Changes' : 'Add Item' }}</span>
                </button>
                <button
                  type="button"
                  @click="emit('close')"
                  class="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import axios from '@/axios'

const props = defineProps({
  orderType: String
})

const tables = ref([])
const selectedTable = ref(null)
const loading = ref(false)
const error = ref('')
const date = ref(new Date().toISOString().split('T')[0])
const time = ref('18:00')

const fetchTables = async () => {
  try {
    loading.value = true
    const response = await axios.get(`/api/tables?date=${date.value}&time=${time.value}`)
    tables.value = response.data
  } catch (err) {
    error.value = err.response?.data?.msg || 'Failed to load tables'
  } finally {
    loading.value = false
  }
}

const reserveTable = async () => {
  try {
    await axios.post('/api/reservations', {
      table: selectedTable.value._id,
      date: date.value,
      time: time.value
    })
    // Handle successful reservation
  } catch (err) {
    error.value = err.response?.data?.msg || 'Reservation failed'
  }
}

onMounted(fetchTables)
</script>

<template>
  <div class="space-y-4">
    <div class="grid grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-medium">Date</label>
        <input v-model="date" type="date" @change="fetchTables"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
      </div>
      <div>
        <label class="block text-sm font-medium">Time</label>
        <input v-model="time" type="time" @change="fetchTables"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
      </div>
    </div>

    <div v-if="error" class="text-red-500 text-sm">{{ error }}</div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div v-for="table in tables" :key="table._id"
        @click="selectedTable = table"
        :class="[
          'p-4 border rounded-lg cursor-pointer transition-colors',
          selectedTable?._id === table._id 
            ? 'border-indigo-500 bg-indigo-50' 
            : 'border-gray-200 hover:border-indigo-300'
        ]">
        <div class="flex justify-between items-center">
          <div>
            <h3 class="font-medium">Table {{ table.number }}</h3>
            <p class="text-sm text-gray-500">{{ table.capacity }} people</p>
          </div>
          <span v-if="table.location" class="text-sm text-gray-500">{{ table.location }}</span>
        </div>
      </div>
    </div>

    <button @click="reserveTable" :disabled="!selectedTable"
      class="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:opacity-50">
      Reserve Table
    </button>
  </div>
</template>
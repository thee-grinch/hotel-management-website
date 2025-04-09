<script setup>
import { ref, onMounted } from 'vue'
import axios from '@/axios'
import { CalendarIcon, ClockIcon, UserIcon, TableCellsIcon } from '@heroicons/vue/20/solid'
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'
import { EllipsisVerticalIcon } from '@heroicons/vue/24/outline'

const reservations = ref([])
const loading = ref(false)
const error = ref('')
const dateFilter = ref(new Date().toISOString().split('T')[0])
const statusFilter = ref('')

const statusOptions = [
  { value: '', label: 'All Statuses' },
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'completed', label: 'Completed' }
]

const fetchReservations = async () => {
  try {
    loading.value = true
    const params = {}
    if (dateFilter.value) params.date = dateFilter.value
    if (statusFilter.value) params.status = statusFilter.value
    
    const response = await axios.get('/api/reservations', { params })
    reservations.value = response.data
  } catch (err) {
    error.value = err.response?.data?.msg || 'Failed to fetch reservations'
  } finally {
    loading.value = false
  }
}

const updateStatus = async (reservationId, newStatus) => {
  try {
    await axios.put(`/api/reservations/${reservationId}/status`, { status: newStatus })
    await fetchReservations()
  } catch (err) {
    error.value = err.response?.data?.msg || 'Failed to update reservation status'
  }
}

onMounted(() => {
  fetchReservations()
})
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Reservation Management</h1>
      <div class="flex space-x-4">
        <div>
          <label class="sr-only">Date</label>
          <input
            v-model="dateFilter"
            type="date"
            @change="fetchReservations"
            class="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label class="sr-only">Status</label>
          <select
            v-model="statusFilter"
            @change="fetchReservations"
            class="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option v-for="option in statusOptions" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
        </div>
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
      <div v-for="i in 3" :key="i" class="bg-gray-100 rounded-lg h-20 animate-pulse"></div>
    </div>
    
    <div v-else class="bg-white shadow overflow-hidden sm:rounded-md">
      <ul class="divide-y divide-gray-200">
        <li v-for="reservation in reservations" :key="reservation._id">
          <div class="px-4 py-4 sm:px-6">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-4">
                <div class="flex-shrink-0 bg-indigo-100 p-3 rounded-full">
                  <CalendarIcon class="h-6 w-6 text-indigo-600" />
                </div>
                <div>
                  <div class="text-lg font-medium text-gray-900">
                    {{ new Date(reservation.date).toLocaleDateString() }}
                    <span class="text-gray-500 ml-2">
                      <ClockIcon class="h-4 w-4 inline mr-1" />
                      {{ reservation.time }}
                    </span>
                  </div>
                  <div class="mt-1 text-sm text-gray-500">
                    <UserIcon class="h-4 w-4 inline mr-1" />
                    {{ reservation.user.name }}
                    <span class="mx-2">•</span>
                    <TableCellsIcon class="h-4 w-4 inline mr-1" />
                    Table {{ reservation.table.number }} ({{ reservation.table.capacity }} people)
                  </div>
                </div>
              </div>
              <div class="flex items-center">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" 
                  :class="{
                    'bg-yellow-100 text-yellow-800': reservation.status === 'pending',
                    'bg-green-100 text-green-800': reservation.status === 'confirmed',
                    'bg-red-100 text-red-800': reservation.status === 'cancelled',
                    'bg-gray-100 text-gray-800': reservation.status === 'completed'
                  }"
                >
                  {{ reservation.status }}
                </span>
                <Menu as="div" class="relative ml-4">
                  <MenuButton class="flex items-center text-gray-400 hover:text-gray-600">
                    <EllipsisVerticalIcon class="h-5 w-5" aria-hidden="true" />
                  </MenuButton>
                  <MenuItems class="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <MenuItem v-slot="{ active }" v-for="status in ['confirmed', 'cancelled', 'completed']" :key="status">
                      <button
                        @click="updateStatus(reservation._id, status)"
                        :class="[active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700 w-full text-left']"
                        :disabled="reservation.status === status"
                      >
                        Mark as {{ status }}
                      </button>
                    </MenuItem>
                  </MenuItems>
                </Menu>
              </div>
            </div>
          </div>
        </li>
      </ul>
      <div v-if="reservations.length === 0" class="px-4 py-6 text-center text-gray-500">
        No reservations found
      </div>
    </div>
  </div>
</template>
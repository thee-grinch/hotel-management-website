<script setup>
import { ref, computed } from 'vue'
import { useCartStore } from '@/stores/cart'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/vue/20/solid'
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/vue'
import Notification from '@/components/Notification.vue'

const cartStore = useCartStore()
const authStore = useAuthStore()
const router = useRouter()

const orderTypeOptions = [
  { id: 'dine-in', name: 'Dine In' },
  { id: 'takeaway', name: 'Takeaway' }
]

const tables = ref([])
const loadingTables = ref(false)
const notification = ref(null)

const fetchAvailableTables = async () => {
  if (cartStore.orderType !== 'dine-in') return
  
  try {
    loadingTables.value = true
    const response = await axios.get('/api/tables?available=true')
    tables.value = response.data
  } catch (error) {
    console.error('Failed to fetch tables:', error)
  } finally {
    loadingTables.value = false
  }
}

// Watch for order type changes
watch(() => cartStore.orderType, (newVal) => {
  if (newVal === 'dine-in') {
    fetchAvailableTables()
  } else {
    cartStore.selectedTable = null
  }
}, { immediate: true })

const handleSubmitOrder = async () => {
  const result = await cartStore.submitOrder()
  
  if (result.success) {
    notification.value = {
      type: 'success',
      message: 'Order placed successfully!'
    }
    router.push({ name: 'orders' })
  } else {
    notification.value = {
      type: 'error',
      message: result.error
    }
  }
}
</script>

<template>
  <div class="py-8">
    <h1 class="text-3xl font-bold text-gray-900 mb-8">Your Cart</h1>
    
    <Notification 
      v-if="notification"
      :type="notification.type"
      :message="notification.message"
      @dismiss="notification = null"
    />
    
    <div v-if="cartStore.items.length === 0" class="text-center py-12">
      <p class="text-gray-500 text-lg">Your cart is empty</p>
      <RouterLink to="/menu" class="mt-4 inline-block text-indigo-600 hover:text-indigo-800">
        Browse our menu
      </RouterLink>
    </div>
    
    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div class="lg:col-span-2">
        <div class="bg-white shadow rounded-lg overflow-hidden">
          <div class="divide-y divide-gray-200">
            <div v-for="item in cartStore.items" :key="item.menuItem" class="p-4 flex">
              <div class="flex-shrink-0 h-20 w-20 bg-gray-200 rounded-md overflow-hidden">
                <img v-if="item.image" :src="item.image" :alt="item.name" class="h-full w-full object-cover">
              </div>
              
              <div class="ml-4 flex-1">
                <div class="flex justify-between">
                  <h3 class="text-lg font-medium text-gray-900">{{ item.name }}</h3>
                  <p class="ml-4 font-medium text-gray-900">${{ item.price.toFixed(2) }}</p>
                </div>
                
                <div class="mt-2 flex justify-between items-center">
                  <div class="flex items-center">
                    <button 
                      @click="cartStore.updateQuantity(item.menuItem, item.quantity - 1)"
                      :disabled="item.quantity <= 1"
                      class="px-2 py-1 border border-gray-300 rounded-l-md bg-gray-50 text-gray-500 hover:bg-gray-100 disabled:opacity-50"
                    >
                      -
                    </button>
                    <span class="px-4 py-1 border-t border-b border-gray-300 bg-white text-gray-700">
                      {{ item.quantity }}
                    </span>
                    <button 
                      @click="cartStore.updateQuantity(item.menuItem, item.quantity + 1)"
                      class="px-2 py-1 border border-gray-300 rounded-r-md bg-gray-50 text-gray-500 hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                  
                  <button 
                    @click="cartStore.removeItem(item.menuItem)"
                    class="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
                
                <div class="mt-2">
                  <label for="specialInstructions" class="sr-only">Special Instructions</label>
                  <input
                    v-model="item.specialInstructions"
                    type="text"
                    placeholder="Special instructions (optional)"
                    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="lg:col-span-1">
        <div class="bg-white shadow rounded-lg p-6">
          <h2 class="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
          
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Order Type</label>
              <Listbox v-model="cartStore.orderType">
                <div class="relative mt-1">
                  <ListboxButton
                    class="relative w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                  >
                    <span class="block truncate">{{
                      orderTypeOptions.find(opt => opt.id === cartStore.orderType)?.name
                    }}</span>
                    <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                      <ChevronUpDownIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </span>
                  </ListboxButton>
                  
                  <transition
                    leave-active-class="transition duration-100 ease-in"
                    leave-from-class="opacity-100"
                    leave-to-class="opacity-0"
                  >
                    <ListboxOptions
                      class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm"
                    >
                      <ListboxOption
                        v-for="option in orderTypeOptions"
                        :key="option.id"
                        :value="option.id"
                        v-slot="{ active, selected }"
                        as="template"
                      >
                        <li
                          :class="[
                            active ? 'bg-indigo-100 text-indigo-900' : 'text-gray-900',
                            'relative cursor-default select-none py-2 pl-3 pr-9'
                          ]"
                        >
                          <span :class="[selected ? 'font-semibold' : 'font-normal', 'block truncate']">
                            {{ option.name }}
                          </span>
                          <span
                            v-if="selected"
                            :class="[
                              active ? 'text-white' : 'text-indigo-600',
                              'absolute inset-y-0 right-0 flex items-center pr-4'
                            ]"
                          >
                            <CheckIcon class="h-5 w-5" aria-hidden="true" />
                          </span>
                        </li>
                      </ListboxOption>
                    </ListboxOptions>
                  </transition>
                </div>
              </Listbox>
            </div>
            
            <div v-if="cartStore.orderType === 'dine-in'">
              <label class="block text-sm font-medium text-gray-700 mb-1">Select Table</label>
              <Listbox v-model="cartStore.selectedTable">
                <div class="relative mt-1">
                  <ListboxButton
                    class="relative w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                    :disabled="loadingTables || tables.length === 0"
                  >
                    <span class="block truncate">
                      {{
                        cartStore.selectedTable
                          ? `Table ${cartStore.selectedTable.number} (${cartStore.selectedTable.capacity} people)`
                          : 'Select a table'
                      }}
                    </span>
                    <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                      <ChevronUpDownIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </span>
                  </ListboxButton>
                  
                  <transition
                    leave-active-class="transition duration-100 ease-in"
                    leave-from-class="opacity-100"
                    leave-to-class="opacity-0"
                  >
                    <ListboxOptions
                      class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm"
                    >
                      <ListboxOption
                        v-for="table in tables"
                        :key="table._id"
                        :value="table"
                        v-slot="{ active, selected }"
                        as="template"
                      >
                        <li
                          :class="[
                            active ? 'bg-indigo-100 text-indigo-900' : 'text-gray-900',
                            'relative cursor-default select-none py-2 pl-3 pr-9'
                          ]"
                        >
                          <span :class="[selected ? 'font-semibold' : 'font-normal', 'block truncate']">
                            Table {{ table.number }} ({{ table.capacity }} people)
                          </span>
                          <span
                            v-if="selected"
                            :class="[
                              active ? 'text-white' : 'text-indigo-600',
                              'absolute inset-y-0 right-0 flex items-center pr-4'
                            ]"
                          >
                            <CheckIcon class="h-5 w-5" aria-hidden="true" />
                          </span>
                        </li>
                      </ListboxOption>
                    </ListboxOptions>
                  </transition>
                </div>
              </Listbox>
            </div>
            
            <div class="border-t border-gray-200 pt-4">
              <div class="flex justify-between text-base font-medium text-gray-900">
                <p>Subtotal</p>
                <p>${{ cartStore.total.toFixed(2) }}</p>
              </div>
              <p class="mt-1 text-sm text-gray-500">Taxes calculated at checkout</p>
              
              <button
                @click="handleSubmitOrder"
                :disabled="cartStore.loading || (cartStore.orderType === 'dine-in' && !cartStore.selectedTable)"
                class="mt-6 w-full rounded-md border border-transparent bg-indigo-600 py-3 px-4 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ cartStore.loading ? 'Processing...' : 'Place Order' }}
              </button>
              
              <div v-if="!authStore.isAuthenticated" class="mt-4 text-center text-sm text-gray-500">
                <RouterLink 
                  :to="{ name: 'login', query: { redirect: '/cart' } }" 
                  class="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Login
                </RouterLink>
                <span> or </span>
                <RouterLink 
                  :to="{ name: 'register', query: { redirect: '/cart' } }" 
                  class="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Register
                </RouterLink>
                <span> to place your order</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
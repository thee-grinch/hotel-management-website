<script setup>
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'
import { Bars3Icon, XMarkIcon, ShoppingCartIcon, UserIcon } from '@heroicons/vue/24/outline'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

const authStore = useAuthStore()
const cartStore = useCartStore()

const cartItemCount = computed(() => cartStore.items.reduce((total, item) => total + item.quantity, 0))
</script>

<template>
  <header class="bg-white shadow-sm">
    <div class="container mx-auto px-4 py-4 flex justify-between items-center">
      <RouterLink to="/" class="text-2xl font-bold text-indigo-600">Restaurant</RouterLink>
      
      <div class="sm:hidden md:flex items-center space-x-6">
        <RouterLink to="/menu" class="text-gray-700 hover:text-indigo-600">Menu</RouterLink>
        
        <RouterLink v-if="authStore.isAuthenticated" to="/orders" class="text-gray-700 hover:text-indigo-600">
          My Orders
        </RouterLink>
        
        <RouterLink v-if="authStore.user?.role === 'admin'" to="/admin" class="text-gray-700 hover:text-indigo-600">
          Admin
        </RouterLink>
        
        <RouterLink to="/cart" class="relative text-gray-700 hover:text-indigo-600">
          <ShoppingCartIcon class="h-6 w-6" />
          <span v-if="cartItemCount > 0" class="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {{ cartItemCount }}
          </span>
        </RouterLink>
        
        <Menu as="div" class="relative" v-if="authStore.isAuthenticated">
          <MenuButton class="flex items-center space-x-1 text-gray-700 hover:text-indigo-600">
            <UserIcon class="h-6 w-6" />
            <span>{{ authStore.user?.name }}</span>
          </MenuButton>
          <transition
            enter-active-class="transition duration-100 ease-out"
            enter-from-class="transform scale-95 opacity-0"
            enter-to-class="transform scale-100 opacity-100"
            leave-active-class="transition duration-75 ease-in"
            leave-from-class="transform scale-100 opacity-100"
            leave-to-class="transform scale-95 opacity-0"
          >
            <MenuItems class="absolute right-0 mt-2 w-48 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
              <div class="px-1 py-1">
                <MenuItem v-slot="{ active }">
                  <RouterLink
                    to="/profile"
                    :class="[active ? 'bg-indigo-500 text-white' : 'text-gray-900', 'block px-4 py-2 text-sm rounded-md']"
                  >
                    Profile
                  </RouterLink>
                </MenuItem>
                <MenuItem v-slot="{ active }">
                  <button
                    @click="authStore.logout"
                    :class="[active ? 'bg-indigo-500 text-white' : 'text-gray-900', 'block w-full text-left px-4 py-2 text-sm rounded-md']"
                  >
                    Logout
                  </button>
                </MenuItem>
              </div>
            </MenuItems>
          </transition>
        </Menu>
        
        <template v-else>
          <RouterLink to="/login" class="text-gray-700 hover:text-indigo-600">Login</RouterLink>
          <RouterLink to="/register" class="text-gray-700 hover:text-indigo-600">Register</RouterLink>
        </template>
      </div>
      
      <div class="md:hidden">
        <Menu as="div" class="relative">
          <MenuButton class="text-gray-700 hover:text-indigo-600">
            <Bars3Icon class="h-6 w-6" />
          </MenuButton>
          <transition
            enter-active-class="transition duration-100 ease-out"
            enter-from-class="transform scale-95 opacity-0"
            enter-to-class="transform scale-100 opacity-100"
            leave-active-class="transition duration-75 ease-in"
            leave-from-class="transform scale-100 opacity-100"
            leave-to-class="transform scale-95 opacity-0"
          >
            <MenuItems class="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
              <div class="px-1 py-1">
                <MenuItem v-slot="{ active }">
                  <RouterLink
                    to="/menu"
                    :class="[active ? 'bg-indigo-500 text-white' : 'text-gray-900', 'block px-4 py-2 text-sm rounded-md']"
                  >
                    Menu
                  </RouterLink>
                </MenuItem>
                
                <MenuItem v-slot="{ active }" v-if="authStore.isAuthenticated">
                  <RouterLink
                    to="/orders"
                    :class="[active ? 'bg-indigo-500 text-white' : 'text-gray-900', 'block px-4 py-2 text-sm rounded-md']"
                  >
                    My Orders
                  </RouterLink>
                </MenuItem>
                
                <MenuItem v-slot="{ active }" v-if="authStore.user?.role === 'admin'">
                  <RouterLink
                    to="/admin"
                    :class="[active ? 'bg-indigo-500 text-white' : 'text-gray-900', 'block px-4 py-2 text-sm rounded-md']"
                  >
                    Admin
                  </RouterLink>
                </MenuItem>
              </div>
              
              <div class="px-1 py-1">
                <MenuItem v-slot="{ active }">
                  <RouterLink
                    to="/cart"
                    :class="[active ? 'bg-indigo-500 text-white' : 'text-gray-900', 'block px-4 py-2 text-sm rounded-md flex items-center']"
                  >
                    <ShoppingCartIcon class="h-5 w-5 mr-2" />
                    Cart
                    <span v-if="cartItemCount > 0" class="ml-auto bg-indigo-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {{ cartItemCount }}
                    </span>
                  </RouterLink>
                </MenuItem>
              </div>
              
              <div class="px-1 py-1" v-if="authStore.isAuthenticated">
                <MenuItem v-slot="{ active }">
                  <RouterLink
                    to="/profile"
                    :class="[active ? 'bg-indigo-500 text-white' : 'text-gray-900', 'block px-4 py-2 text-sm rounded-md']"
                  >
                    Profile
                  </RouterLink>
                </MenuItem>
                <MenuItem v-slot="{ active }">
                  <button
                    @click="authStore.logout"
                    :class="[active ? 'bg-indigo-500 text-white' : 'text-gray-900', 'block w-full text-left px-4 py-2 text-sm rounded-md']"
                  >
                    Logout
                  </button>
                </MenuItem>
              </div>
              
              <div class="px-1 py-1" v-else>
                <MenuItem v-slot="{ active }">
                  <RouterLink
                    to="/login"
                    :class="[active ? 'bg-indigo-500 text-white' : 'text-gray-900', 'block px-4 py-2 text-sm rounded-md']"
                  >
                    Login
                  </RouterLink>
                </MenuItem>
                <MenuItem v-slot="{ active }">
                  <RouterLink
                    to="/register"
                    :class="[active ? 'bg-indigo-500 text-white' : 'text-gray-900', 'block px-4 py-2 text-sm rounded-md']"
                  >
                    Register
                  </RouterLink>
                </MenuItem>
              </div>
            </MenuItems>
          </transition>
        </Menu>
      </div>
    </div>
  </header>
</template>
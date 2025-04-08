<script setup>
import {
  ChartBarIcon,
  CogIcon,
  ShoppingBagIcon,
  TableCellsIcon,
  UserGroupIcon,
  XMarkIcon
} from '@heroicons/vue/24/outline'
import { ref } from 'vue'
import { RouterLink } from 'vue-router'

const sidebarOpen = ref(true)
</script>

<template>
  <div class="relative">
    <!-- Mobile sidebar -->
    <div v-if="sidebarOpen" class="md:hidden fixed inset-0 z-40">
      <div class="fixed inset-0 bg-gray-600 bg-opacity-75" @click="sidebarOpen = false"></div>
      <div class="fixed inset-y-0 left-0 flex w-64 z-50">
        <div class="relative flex w-full max-w-xs flex-1 flex-col bg-white">
          <div class="absolute top-0 right-0 -mr-12 pt-2">
            <button
              type="button"
              class="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              @click="sidebarOpen = false"
            >
              <span class="sr-only">Close sidebar</span>
              <XMarkIcon class="h-6 w-6 text-white" aria-hidden="true" />
            </button>
          </div>
          <div class="h-0 flex-1 overflow-y-auto pt-5 pb-4">
            <div class="flex flex-shrink-0 items-center px-4">
              <h1 class="text-xl font-bold text-indigo-600">Admin Panel</h1>
            </div>
            <nav class="mt-5 space-y-1 px-2">
              <RouterLink
                to="/admin/menu"
                class="group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                :class="[$route.path.includes('/admin/menu') ? 'bg-indigo-100 text-indigo-600' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900']"
              >
                <ShoppingBagIcon
                  class="mr-3 h-6 w-6 flex-shrink-0"
                  :class="[$route.path.includes('/admin/menu') ? 'text-indigo-500' : 'text-gray-400 group-hover:text-gray-500']"
                  aria-hidden="true"
                />
                Menu Management
              </RouterLink>
              <RouterLink
                to="/admin/orders"
                class="group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                :class="[$route.path.includes('/admin/orders') ? 'bg-indigo-100 text-indigo-600' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900']"
              >
                <ChartBarIcon
                  class="mr-3 h-6 w-6 flex-shrink-0"
                  :class="[$route.path.includes('/admin/orders') ? 'text-indigo-500' : 'text-gray-400 group-hover:text-gray-500']"
                  aria-hidden="true"
                />
                Order Management
              </RouterLink>
              <RouterLink
                to="/admin/tables"
                class="group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                :class="[$route.path.includes('/admin/tables') ? 'bg-indigo-100 text-indigo-600' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900']"
              >
                <TableCellsIcon
                  class="mr-3 h-6 w-6 flex-shrink-0"
                  :class="[$route.path.includes('/admin/tables') ? 'text-indigo-500' : 'text-gray-400 group-hover:text-gray-500']"
                  aria-hidden="true"
                />
                Table Management
              </RouterLink>
              <RouterLink
                to="/admin/users"
                class="group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                :class="[$route.path.includes('/admin/users') ? 'bg-indigo-100 text-indigo-600' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900']"
              >
                <UserGroupIcon
                  class="mr-3 h-6 w-6 flex-shrink-0"
                  :class="[$route.path.includes('/admin/users') ? 'text-indigo-500' : 'text-gray-400 group-hover:text-gray-500']"
                  aria-hidden="true"
                />
                User Management
              </RouterLink>
              <RouterLink
                to="/admin/settings"
                class="group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                :class="[$route.path.includes('/admin/settings') ? 'bg-indigo-100 text-indigo-600' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900']"
              >
                <CogIcon
                  class="mr-3 h-6 w-6 flex-shrink-0"
                  :class="[$route.path.includes('/admin/settings') ? 'text-indigo-500' : 'text-gray-400 group-hover:text-gray-500']"
                  aria-hidden="true"
                />
                Settings
              </RouterLink>
            </nav>
          </div>
        </div>
      </div>
    </div>

    <!-- Desktop sidebar -->
    <div class="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
      <div class="flex min-h-0 flex-1 flex-col border-r border-gray-200 bg-white">
        <div class="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
          <div class="flex flex-shrink-0 items-center px-4">
            <h1 class="text-xl font-bold text-indigo-600">Admin Panel</h1>
          </div>
          <nav class="mt-5 flex-1 space-y-1 bg-white px-2">
            <RouterLink
              to="/admin/menu"
              class="group flex items-center px-2 py-2 text-sm font-medium rounded-md"
              :class="[$route.path.includes('/admin/menu') ? 'bg-indigo-100 text-indigo-600' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900']"
            >
              <ShoppingBagIcon
                class="mr-3 h-6 w-6 flex-shrink-0"
                :class="[$route.path.includes('/admin/menu') ? 'text-indigo-500' : 'text-gray-400 group-hover:text-gray-500']"
                aria-hidden="true"
              />
              Menu Management
            </RouterLink>
            <RouterLink
              to="/admin/orders"
              class="group flex items-center px-2 py-2 text-sm font-medium rounded-md"
              :class="[$route.path.includes('/admin/orders') ? 'bg-indigo-100 text-indigo-600' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900']"
            >
              <ChartBarIcon
                class="mr-3 h-6 w-6 flex-shrink-0"
                :class="[$route.path.includes('/admin/orders') ? 'text-indigo-500' : 'text-gray-400 group-hover:text-gray-500']"
                aria-hidden="true"
              />
              Order Management
            </RouterLink>
            <RouterLink
              to="/admin/tables"
              class="group flex items-center px-2 py-2 text-sm font-medium rounded-md"
              :class="[$route.path.includes('/admin/tables') ? 'bg-indigo-100 text-indigo-600' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900']"
            >
              <TableCellsIcon
                class="mr-3 h-6 w-6 flex-shrink-0"
                :class="[$route.path.includes('/admin/tables') ? 'text-indigo-500' : 'text-gray-400 group-hover:text-gray-500']"
                aria-hidden="true"
              />
              Table Management
            </RouterLink>
            <RouterLink
              to="/admin/users"
              class="group flex items-center px-2 py-2 text-sm font-medium rounded-md"
              :class="[$route.path.includes('/admin/users') ? 'bg-indigo-100 text-indigo-600' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900']"
            >
              <UserGroupIcon
                class="mr-3 h-6 w-6 flex-shrink-0"
                :class="[$route.path.includes('/admin/users') ? 'text-indigo-500' : 'text-gray-400 group-hover:text-gray-500']"
                aria-hidden="true"
              />
              User Management
            </RouterLink>
            <RouterLink
              to="/admin/settings"
              class="group flex items-center px-2 py-2 text-sm font-medium rounded-md"
              :class="[$route.path.includes('/admin/settings') ? 'bg-indigo-100 text-indigo-600' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900']"
            >
              <CogIcon
                class="mr-3 h-6 w-6 flex-shrink-0"
                :class="[$route.path.includes('/admin/settings') ? 'text-indigo-500' : 'text-gray-400 group-hover:text-gray-500']"
                aria-hidden="true"
              />
              Settings
            </RouterLink>
          </nav>
        </div>
      </div>
    </div>
  </div>
</template>
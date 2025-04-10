<script setup>
import {
  ChartBarIcon,
  CogIcon,
  ShoppingBagIcon,
  TableCellsIcon,
  UserGroupIcon,
  XMarkIcon
} from '@heroicons/vue/24/outline';
import { ref } from 'vue';
import { RouterLink } from 'vue-router';

const sidebarOpen = ref(false); // Sidebar toggle for small screens
</script>

<template>
  <div class="flex h-screen">
    <!-- Sidebar for large screens -->
    <div class="sm:hidden md:flex md:w-64 md:flex-col bg-white border-r border-gray-200">
      <div class="flex flex-col flex-1 overflow-y-auto">
        <div class="flex items-center justify-center h-16 bg-indigo-600 text-white">
          <h1 class="text-lg font-bold">Admin Panel</h1>
        </div>
        <nav class="mt-5 flex-1 px-2 space-y-1">
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

    <!-- Sidebar for small screens -->
    <div
      v-if="sidebarOpen"
      class="fixed inset-0 z-40 flex md:hidden"
    >
      <div class="fixed inset-0 bg-gray-600 bg-opacity-75" @click="sidebarOpen = false"></div>
      <div class="relative flex w-64 flex-col bg-white">
        <div class="flex items-center justify-between h-16 px-4 bg-indigo-600 text-white">
          <h1 class="text-lg font-bold">Admin Panel</h1>
          <button
            type="button"
            class="focus:outline-none"
            @click="sidebarOpen = false"
          >
            <XMarkIcon class="h-6 w-6" />
          </button>
        </div>
        <nav class="mt-5 flex-1 px-2 space-y-1">
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
          <!-- Add other links here -->
        </nav>
      </div>
    </div>

    <!-- Main content -->
    <div class="flex-1 flex flex-col">
      <header class="bg-white shadow md:hidden">
        <div class="flex items-center justify-between px-4 py-4">
          <h1 class="text-lg font-bold text-indigo-600">Admin Panel</h1>
          <button
            type="button"
            class="focus:outline-none"
            @click="sidebarOpen = true"
          >
            <ChartBarIcon class="h-6 w-6 text-indigo-600" />
          </button>
        </div>
      </header>
      <main class="flex-1 p-4">
        <slot />
      </main>
    </div>
  </div>
</template>
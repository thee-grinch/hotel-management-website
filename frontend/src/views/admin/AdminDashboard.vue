<script setup>
import { RouterView } from 'vue-router'
import AdminSidebar from '@/components/admin/AdminSidebar.vue'
</script>

<template>
  <div class="flex min-h-screen">
    <AdminSidebar />
    
    <div class="flex-1">
      <div class="container mx-auto px-4 py-8">
        <RouterView />
      </div>
    </div>
  </div>
</template>
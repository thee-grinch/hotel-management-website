<script setup>
import { RouterView } from 'vue-router'
import NavBar from '@/components/NavBar.vue'
import NotificationContainer from '@/components/NotificationContainer.vue'
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <NavBar />
    <NotificationContainer />
    <main class="container mx-auto px-4 py-8">
      <RouterView />
    </main>
  </div>
</template>
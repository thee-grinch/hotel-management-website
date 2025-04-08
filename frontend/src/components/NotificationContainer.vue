<script setup>
import { ref } from 'vue'
import Notification from './Notification.vue'

const notifications = ref([])

const showNotification = (type, message) => {
  const id = Date.now()
  notifications.value.push({ id, type, message })
  
  setTimeout(() => {
    notifications.value = notifications.value.filter(n => n.id !== id)
  }, 5000)
}

defineExpose({ showNotification })
</script>

<template>
  <div class="fixed top-4 right-4 z-50 space-y-2 w-80">
    <Notification
      v-for="notification in notifications"
      :key="notification.id"
      :type="notification.type"
      :message="notification.message"
      @dismiss="notifications = notifications.filter(n => n.id !== notification.id)"
    />
  </div>
</template>
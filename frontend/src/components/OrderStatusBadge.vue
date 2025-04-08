<script setup>
const props = defineProps({
  status: {
    type: String,
    required: true
  }
})

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  preparing: 'bg-purple-100 text-purple-800',
  ready: 'bg-green-100 text-green-800',
  delivered: 'bg-indigo-100 text-indigo-800',
  cancelled: 'bg-red-100 text-red-800'
}
</script>

<template>
  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" 
    :class="statusColors[status]">
    {{ status }}
  </span>
</template>
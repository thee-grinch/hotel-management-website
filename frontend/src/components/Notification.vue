<script setup>
import { XMarkIcon } from '@heroicons/vue/20/solid'

defineProps({
  type: {
    type: String,
    required: true,
    validator: (value) => ['success', 'error', 'info', 'warning'].includes(value)
  },
  message: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['dismiss'])

const typeClasses = {
  success: 'bg-green-50 border-green-400 text-green-700',
  error: 'bg-red-50 border-red-400 text-red-700',
  info: 'bg-blue-50 border-blue-400 text-blue-700',
  warning: 'bg-yellow-50 border-yellow-400 text-yellow-700'
}

const iconClasses = {
  success: 'text-green-400',
  error: 'text-red-400',
  info: 'text-blue-400',
  warning: 'text-yellow-400'
}
</script>

<template>
  <div class="rounded-md border-l-4 p-4 shadow" :class="typeClasses[type]">
    <div class="flex">
      <div class="flex-shrink-0">
        <component 
          :is="type === 'success' ? CheckCircleIcon : 
                type === 'error' ? XCircleIcon : 
                type === 'warning' ? ExclamationTriangleIcon : InformationCircleIcon"
          class="h-5 w-5" 
          :class="iconClasses[type]" 
          aria-hidden="true" 
        />
      </div>
      <div class="ml-3">
        <p class="text-sm font-medium">{{ message }}</p>
      </div>
      <div class="ml-auto pl-3">
        <div class="-mx-1.5 -my-1.5">
          <button
            type="button"
            class="inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2"
            :class="{
              'bg-green-50 text-green-500 hover:bg-green-100 focus:ring-green-600': type === 'success',
              'bg-red-50 text-red-500 hover:bg-red-100 focus:ring-red-600': type === 'error',
              'bg-blue-50 text-blue-500 hover:bg-blue-100 focus:ring-blue-600': type === 'info',
              'bg-yellow-50 text-yellow-500 hover:bg-yellow-100 focus:ring-yellow-600': type === 'warning'
            }"
            @click="emit('dismiss')"
          >
            <span class="sr-only">Dismiss</span>
            <XMarkIcon class="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
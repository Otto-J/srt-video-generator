<script setup lang="ts">
import { cn } from '@/lib/utils';

defineProps<{
  role: string;
  isSpeaking: boolean;
}>();
</script>

<template>
  <div
    :class="
      cn(
        'w-24 h-24 rounded-full flex items-center justify-center text-2xl font-bold text-white transition-all duration-300',
        isSpeaking ? 'scale-110 ring-4 ring-primary' : 'scale-100',
        role === 'xinbao' ? 'bg-blue-500' : role === 'Smart' ? 'bg-green-500' : 'bg-purple-500'
      )
    "
  >
    {{ role.charAt(0) }}
  </div>
</template>

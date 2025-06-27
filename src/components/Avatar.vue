<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps<{
  role: string
  isSpeaking: boolean
  config: Array<{
    type: string
    name: string
  }>
}>()

const avatarUrl = computed(() => {
  try {
    // 将角色名转换为小写以匹配文件名
    return new URL(`/public/avatar/${props.role.toLowerCase()}.jpg`, import.meta.url).href
  } catch (e) {
    console.error(`Avatar for role "${props.role}" not found.`, e)
    // 提供一个备用图片或返回空字符串
    return ''
  }
})
</script>

<template>
  <div :class="cn('relative w-32 h-32 transition-all duration-300', { 'scale-110': isSpeaking })">
    <img
      :src="avatarUrl"
      :alt="role"
      :class="
        cn('w-full h-full rounded-full object-cover border-4 border-transparent', {
          'ring-4 ring-primary': isSpeaking,
        })
      "
    />
    <div
      class="absolute bottom-1 -right-2 bg-white text-gray-800 px-3 py-1 rounded-full text-base font-bold shadow-lg"
    >
      {{ role }}
    </div>
  </div>
</template>

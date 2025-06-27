<script setup lang="ts">
import Avatar from './Avatar.vue'
import Subtitle from './Subtitle.vue'
import type { Dialogue } from '@/data/conversation'
import config from '@/data/config.json'

const speakers = config.speakers
const guest = config.guest

defineProps<{
  activeDialogue: Dialogue | null
}>()
</script>

<template>
  <div class="relative w-full h-full flex flex-col items-center justify-center gap-8">
    <div class="flex gap-8">
      <Avatar
        :config="config.speakers"
        v-for="item of speakers"
        :key="item.type"
        :role="item.name"
        :is-speaking="activeDialogue?.role === item.name"
      />
    </div>
    <div class="flex">
      <Avatar
        :config="config.guest"
        v-for="item of guest"
        :key="item.type"
        :role="item.name"
        :is-speaking="activeDialogue?.role === item.name"
      />
    </div>
    <Subtitle v-if="activeDialogue" :text="activeDialogue.text" />
  </div>
</template>

<script setup lang="ts">
import Avatar from './Avatar.vue';
import Subtitle from './Subtitle.vue';
import type { Dialogue } from '@/data/conversation';

defineProps<{
  activeDialogue: Dialogue | null;
}>();
</script>

<template>
  <div class="relative w-full h-full flex flex-col items-center justify-center gap-8">
    <div class="flex gap-8">
      <Avatar role="xinbao" :is-speaking="activeDialogue?.role === 'xinbao'" />
      <Avatar role="Smart" :is-speaking="activeDialogue?.role === 'Smart'" />
    </div>
    <div class="flex">
      <Avatar role="Guest1" :is-speaking="activeDialogue?.role === 'Guest1'" />
    </div>
    <Subtitle v-if="activeDialogue" :text="activeDialogue.text" />
  </div>
</template>

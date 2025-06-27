<script setup lang="ts">
import { ref, computed } from 'vue';
import Stage from './components/Stage.vue';
import { Button } from '@/components/ui/button';
import { conversation, type Dialogue } from './data/conversation';

const isPlaying = ref(false);
const currentTime = ref(0);
let animationFrameId: number;

const activeDialogue = computed<Dialogue | null>(() => {
  return conversation.find(d => currentTime.value >= d.startTime && currentTime.value < d.endTime) ?? null;
});

const play = () => {
  isPlaying.value = true;
  const startTime = performance.now() - currentTime.value * 1000;

  const animate = (time: number) => {
    currentTime.value = (time - startTime) / 1000;
    if (currentTime.value < conversation[conversation.length - 1].endTime) {
      animationFrameId = requestAnimationFrame(animate);
    } else {
      isPlaying.value = false;
      currentTime.value = 0;
    }
  };

  animationFrameId = requestAnimationFrame(animate);
};

const pause = () => {
  isPlaying.value = false;
  cancelAnimationFrame(animationFrameId);
};

const togglePlay = () => {
  if (isPlaying.value) {
    pause();
  } else {
    play();
  }
};
</script>

<template>
  <main class="w-full h-screen bg-gradient-to-br from-slate-800 to-primary/40 text-white relative overflow-hidden">
    <div class="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(52,204,133,0.2),rgba(255,255,255,0))]"></div>
    <Stage :active-dialogue="activeDialogue" />
    <div class="absolute top-4 left-4 z-10">
      <Button @click="togglePlay">
        {{ isPlaying ? 'Pause' : 'Play' }}
      </Button>
    </div>
  </main>
</template>
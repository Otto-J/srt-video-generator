<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import Stage from './components/Stage.vue'
import { Button } from '@/components/ui/button'
import { conversation, type Dialogue } from './data/conversation'

// Extend the window interface for TypeScript
interface CustomWindow extends Window {
  onAnimationComplete?: () => void
}
declare const window: CustomWindow

const isPlaying = ref(false)
const currentTime = ref(0)
let animationFrameId: number

const videoRef = ref<HTMLVideoElement | null>(null)
const duration = ref(0)
const isSeeking = ref(false)
const seekTime = ref(0)

const conversationData = ref<Dialogue[]>([])

onMounted(async () => {
  conversationData.value = await conversation()
})

const activeDialogue = computed<Dialogue | null>(() => {
  return (
    conversationData.value.find(
      (d) => currentTime.value >= d.startTime && currentTime.value < d.endTime,
    ) ?? null
  )
})

onMounted(() => {
  if (videoRef.value) {
    videoRef.value.addEventListener('loadedmetadata', () => {
      duration.value = videoRef.value?.duration || 0
    })
  }
})

onUnmounted(() => {
  pause()
})

const handleTimeUpdate = () => {
  if (!isSeeking.value && videoRef.value) {
    currentTime.value = videoRef.value.currentTime
  }
}

const handleSeek = (e: MouseEvent) => {
  if (!videoRef.value || !duration.value) return
  const bar = e.currentTarget as HTMLElement
  const rect = bar.getBoundingClientRect()
  const percent = Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1)
  const newTime = percent * duration.value
  seekTime.value = newTime
  isSeeking.value = true
}

const handleSeekEnd = (e: MouseEvent) => {
  if (!videoRef.value || !duration.value) return
  const bar = e.currentTarget as HTMLElement
  const rect = bar.getBoundingClientRect()
  const percent = Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1)
  const newTime = percent * duration.value
  videoRef.value.currentTime = newTime
  currentTime.value = newTime
  isSeeking.value = false
}

const handleSeekMove = (e: MouseEvent) => {
  if (!isSeeking.value || !duration.value) return
  const bar = e.currentTarget as HTMLElement
  const rect = bar.getBoundingClientRect()
  const percent = Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1)
  seekTime.value = percent * duration.value
}

const displayTime = computed(() => (isSeeking.value ? seekTime.value : currentTime.value))

const play = () => {
  isPlaying.value = true
  if (videoRef.value) {
    videoRef.value.play()
  }
  const startTime = performance.now() - currentTime.value * 1000

  const animate = (time: number) => {
    currentTime.value = (time - startTime) / 1000
    if (currentTime.value < conversationData.value[conversationData.value.length - 1].endTime) {
      animationFrameId = requestAnimationFrame(animate)
    } else {
      isPlaying.value = false
      currentTime.value = 0
      // Signal completion to Puppeteer
      if (typeof window.onAnimationComplete === 'function') {
        window.onAnimationComplete()
      }
    }
  }

  animationFrameId = requestAnimationFrame(animate)
}

const pause = () => {
  isPlaying.value = false
  if (videoRef.value) {
    videoRef.value.pause()
  }
  cancelAnimationFrame(animationFrameId)
}

const togglePlay = () => {
  if (isPlaying.value) {
    pause()
  } else {
    play()
  }
}
</script>

<template>
  <main
    class="w-full h-screen bg-gradient-to-br from-slate-800 to-primary/40 text-white relative overflow-hidden"
  >
    <div
      class="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(52,204,133,0.2),rgba(255,255,255,0))]"
    ></div>
    <Stage :active-dialogue="activeDialogue" />
    <!-- 音频播放器和进度条 -->
    <div
      class="absolute left-1/2 -translate-x-1/2 bottom-2 w-full max-w-4xl px-4 flex flex-col items-center z-20"
    >
      <video
        ref="videoRef"
        class="hidden"
        src="/audio/eva.mp3"
        @timeupdate="handleTimeUpdate"
        preload="auto"
      ></video>
      <!-- 自定义进度条 -->
      <div
        class="w-full h-1 mt-4 bg-gray-300 bg-opacity-40 rounded-full relative cursor-pointer group"
        @mousedown="handleSeek"
        @mousemove="handleSeekMove"
        @mouseup="handleSeekEnd"
        @mouseleave="isSeeking = false"
      >
        <div
          class="h-1 rounded-full bg-green-400 transition-all"
          :style="{ width: ((displayTime / duration) * 100 || 0) + '%' }"
        ></div>
        <div
          v-if="isSeeking"
          class="absolute top-0 left-0 h-3 bg-green-200 opacity-60 rounded-full pointer-events-none"
          :style="{ width: ((seekTime / duration) * 100 || 0) + '%' }"
        ></div>
      </div>
      <div class="flex justify-between w-full text-xs text-gray-200 mt-1">
        <span
          >{{ Math.floor(displayTime / 60) }}:{{
            Math.floor(displayTime % 60)
              .toString()
              .padStart(2, '0')
          }}</span
        >
        <span
          >{{ Math.floor(duration / 60) }}:{{
            Math.floor(duration % 60)
              .toString()
              .padStart(2, '0')
          }}</span
        >
      </div>
    </div>
    <div class="absolute top-4 left-4 z-10">
      <Button
        class="bg-transparent hover:bg-red-400 text-transparent hover:text-white"
        @click="togglePlay"
      >
        {{ isPlaying ? 'Pause' : 'Play' }}
      </Button>
    </div>
  </main>
</template>

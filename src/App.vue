<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import Stage from './components/Stage.vue';
import { Button } from '@/components/ui/button';
import { conversation, type Dialogue } from './data/conversation';
import html2canvas from 'html2canvas';

const isPlaying = ref(false);
const isRecording = ref(false);
const currentTime = ref(0);
let animationFrameId: number;
let mediaRecorder: MediaRecorder | null = null;
let recordedChunks: Blob[] = [];

const stageRef = ref<InstanceType<typeof Stage> | null>(null);
const persistentCanvas = ref<HTMLCanvasElement | null>(null);
const persistentContext = ref<CanvasRenderingContext2D | null>(null);

onMounted(() => {
  if (persistentCanvas.value) {
    persistentContext.value = persistentCanvas.value.getContext('2d');
  }
});

const activeDialogue = computed<Dialogue | null>(() => {
  return conversation.find(d => currentTime.value >= d.startTime && currentTime.value < d.endTime) ?? null;
});

const recordFrame = async () => {
  if (!isRecording.value || !stageRef.value?.$el || !persistentContext.value || !persistentCanvas.value) return;

  const sourceCanvas = await html2canvas(stageRef.value.$el as HTMLElement, {
    useCORS: true,
    allowTaint: true,
    logging: false,
  });
  
  persistentContext.value.clearRect(0, 0, persistentCanvas.value.width, persistentCanvas.value.height);
  persistentContext.value.drawImage(sourceCanvas, 0, 0, persistentCanvas.value.width, persistentCanvas.value.height);
};

const play = () => {
  isPlaying.value = true;
  const startTime = performance.now() - currentTime.value * 1000;

  const animate = (time: number) => {
    currentTime.value = (time - startTime) / 1000;
    
    if (isRecording.value) {
      recordFrame();
    }

    if (currentTime.value < conversation[conversation.length - 1].endTime) {
      animationFrameId = requestAnimationFrame(animate);
    } else {
      isPlaying.value = false;
      currentTime.value = 0;
      if (isRecording.value) {
        stopRecording();
      }
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

const startRecording = async () => {
  if (!stageRef.value?.$el || !persistentCanvas.value) return;

  isRecording.value = true;
  recordedChunks = [];
  currentTime.value = 0;

  // Set canvas dimensions from the stage element
  const stageEl = stageRef.value.$el as HTMLElement;
  persistentCanvas.value.width = stageEl.offsetWidth;
  persistentCanvas.value.height = stageEl.offsetHeight;

  const stream = persistentCanvas.value.captureStream(30); // 30 FPS
  mediaRecorder = new MediaRecorder(stream, {
    mimeType: 'video/webm;codecs=vp9',
  });

  mediaRecorder.ondataavailable = (event) => {
    if (event.data.size > 0) {
      recordedChunks.push(event.data);
    }
  };

  mediaRecorder.onstop = () => {
    const blob = new Blob(recordedChunks, { type: 'video/webm' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'conversation.webm';
    a.click();
    URL.revokeObjectURL(url);
    isRecording.value = false;
  };

  mediaRecorder.start();
  play();
};

const stopRecording = () => {
  if (mediaRecorder && mediaRecorder.state === 'recording') {
    mediaRecorder.stop();
  }
  isRecording.value = false; // Ensure this is set immediately
  cancelAnimationFrame(animationFrameId);
  isPlaying.value = false;
};

</script>

<template>
  <main class="w-full h-screen bg-gradient-to-br from-slate-800 to-primary/40 text-white relative overflow-hidden">
    <div class="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(52,204,133,0.2),rgba(255,255,255,0))]"></div>
    
    <!-- The visible stage for the user -->
    <Stage :active-dialogue="activeDialogue" ref="stageRef" />
    
    <!-- Hidden canvas for recording -->
    <canvas ref="persistentCanvas" class="hidden"></canvas>

    <div class="absolute top-4 left-4 z-10 flex gap-2">
      <Button @click="togglePlay" :disabled="isRecording">
        {{ isPlaying ? 'Pause' : 'Play' }}
      </Button>
      <Button @click="startRecording" :disabled="isRecording">
        {{ isRecording ? 'Recording...' : 'Start Recording' }}
      </Button>
    </div>
  </main>
</template>

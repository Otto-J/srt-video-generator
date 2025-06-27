<script setup lang="ts">
defineProps<{
  text: string;
}>();
</script>

<template>
  <div class="absolute bottom-10 left-1/2 -translate-x-1/2 w-full max-w-4xl px-4">
    <p class="text-center text-2xl font-semibold bg-black bg-opacity-50 text-white p-4 rounded-lg">
      {{ text }}
    </p>
  </div>
</template>

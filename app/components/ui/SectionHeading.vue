<script setup lang="ts">
defineProps<{ id: string; kicker: string; title: string; intro?: string }>()
</script>

<template>
  <RevealOnScroll class="mb-12 max-w-2xl">
    <p class="font-mono text-sm font-medium text-accent">{{ kicker }}</p>
    <h2 :id="id" class="mt-2 font-display text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
      {{ title }}
    </h2>
    <p v-if="intro" class="mt-4 text-lg text-muted">{{ intro }}</p>
  </RevealOnScroll>
</template>

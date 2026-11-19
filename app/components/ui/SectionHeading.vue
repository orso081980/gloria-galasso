<script setup lang="ts">
withDefaults(defineProps<{ id: string; kicker: string; title: string; intro?: string; large?: boolean }>(), { large: false })
</script>

<template>
  <RevealOnScroll class="mb-12" :class="large ? 'max-w-3xl' : 'max-w-2xl'">
    <p class="font-mono text-sm font-medium text-accent">{{ kicker }}</p>
    <h2
      :id="id"
      class="mt-2 font-display font-bold leading-tight tracking-tight"
      :class="large ? 'text-4xl font-black sm:text-6xl' : 'text-4xl sm:text-5xl'"
    >
      {{ title }}
    </h2>
    <p v-if="intro" class="mt-4 text-lg text-muted">{{ intro }}</p>
  </RevealOnScroll>
</template>

<script setup lang="ts">
import type { HeroCopy } from '~/domain/cv/types'

// Decorative: a playful "tokenizer" view of the name (the real name is in the <h1>).
defineProps<{ tokenizer: HeroCopy['tokenizer'] }>()

const tones = ['bg-accent-soft text-accent', 'bg-violet-soft text-violet', 'bg-mint-soft text-mint', 'bg-sun-soft text-ink']
</script>

<template>
  <div class="font-mono text-sm" aria-hidden="true">
    <div class="flex flex-wrap items-center gap-1.5">
      <span class="text-muted">{{ tokenizer.call }}</span>
      <span
        v-for="(token, index) in tokenizer.tokens"
        :key="`${token}-${index}`"
        class="animate-pop rounded-md px-2 py-0.5 font-medium"
        :class="tones[index % tones.length]"
        :style="{ animationDelay: `${600 + index * 140}ms` }"
      >
        {{ token.replace(' ', '·') }}
      </span>
    </div>
    <p class="mt-1 text-muted">{{ tokenizer.caption }}</p>
  </div>
</template>

<script setup lang="ts">
// Decorative: a playful "tokenizer" view of the name (the real name is in the <h1>).
const tokens = [
  { text: 'Glo', tone: 'bg-accent-soft text-accent' },
  { text: 'ria', tone: 'bg-violet-soft text-violet' },
  { text: ' Gal', tone: 'bg-mint-soft text-mint' },
  { text: 'asso', tone: 'bg-sun-soft text-ink' },
]
</script>

<template>
  <div class="font-mono text-sm" aria-hidden="true">
    <div class="flex flex-wrap items-center gap-1.5">
      <span class="text-muted">tokenizer("Gloria Galasso") →</span>
      <span
        v-for="(token, index) in tokens"
        :key="token.text"
        class="animate-pop rounded-md px-2 py-0.5 font-medium"
        :class="token.tone"
        :style="{ animationDelay: `${600 + index * 140}ms` }"
      >
        {{ token.text.replace(' ', '·') }}
      </span>
    </div>
    <p class="mt-1 text-muted">4 tokens, 1 excellent candidate</p>
  </div>
</template>

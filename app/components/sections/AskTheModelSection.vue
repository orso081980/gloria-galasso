<script setup lang="ts">
import type { Question } from '~/domain/cv/types'

const { questions } = useCv()
const { shown, isStreaming, start } = useTextStream()

const active = ref<Question | null>(null)
// Screen readers get the finished answer once, instead of word-by-word chatter.
const announcement = ref('')
let announceTimer: ReturnType<typeof setTimeout> | undefined

function ask(question: Question) {
  active.value = question
  announcement.value = ''
  start(question.answer)
  clearTimeout(announceTimer)
  const delay = prefersReducedMotion() ? 0 : question.answer.split(' ').length * 35 + 100
  announceTimer = setTimeout(() => (announcement.value = question.answer), delay)
}

onBeforeUnmount(() => clearTimeout(announceTimer))
</script>

<template>
  <section id="ask" class="py-20" aria-labelledby="ask-title">
    <div class="mx-auto max-w-6xl px-5 sm:px-8">
      <SectionHeading
        id="ask-title"
        large
        kicker="// now with 0% hallucinations*"
        title="Ask GloriaGPT"
        intro="*Because every answer comes straight from her CV. No GPUs, no API key, no 'as an AI language model'. Pick a question and watch it stream."
      />

      <RevealOnScroll class="overflow-hidden rounded-[2.5rem] bg-night text-night-fg shadow-2xl">
        <div class="flex items-center gap-2 border-b border-white/10 px-5 py-3" aria-hidden="true">
          <span class="size-3 rounded-full bg-[#ff5f57]" />
          <span class="size-3 rounded-full bg-[#febc2e]" />
          <span class="size-3 rounded-full bg-[#28c840]" />
          <span class="ml-3 font-mono text-xs opacity-70">gloriagpt-1b · inference</span>
        </div>

        <div class="p-5 sm:p-8">
          <p class="font-mono text-sm opacity-80" id="prompt-label">Pick a question:</p>
          <ul class="mt-4 flex flex-wrap gap-3" aria-labelledby="prompt-label">
            <li v-for="question in questions" :key="question.id">
              <button
                type="button"
                class="cursor-paw group inline-flex items-center rounded-full border-2 border-coral px-5 py-2.5 text-left text-sm font-semibold shadow-[0_4px_0_0_var(--coral)] transition active:translate-y-1 active:shadow-none sm:text-base"
                :class="
                  active?.id === question.id
                    ? 'translate-y-0.5 bg-coral text-night shadow-[0_2px_0_0_var(--coral)]'
                    : 'bg-white/5 text-night-fg hover:-translate-y-0.5 hover:bg-coral hover:text-night'
                "
                :aria-pressed="active?.id === question.id"
                @click="ask(question)"
              >
                {{ question.prompt }}
              </button>
            </li>
          </ul>

          <div class="mt-8 min-h-48 rounded-2xl bg-black/30 p-5 font-mono text-sm leading-relaxed sm:text-base">
            <template v-if="active">
              <p class="text-[#7ee0c5]"><span aria-hidden="true">&gt; </span>{{ active.prompt }}</p>
              <p class="mt-3" aria-hidden="true">
                {{ shown }}<span v-if="isStreaming" class="animate-blink">▍</span>
              </p>
              <p v-if="!isStreaming" class="mt-4 text-xs opacity-70" aria-hidden="true">
                confidence: {{ active.confidence.toFixed(2) }} · source: {{ active.source }}
              </p>
            </template>
            <p v-else class="opacity-60">
              Waiting for a prompt<span class="animate-blink">▍</span>
            </p>
          </div>

          <p class="sr-only" role="status" aria-live="polite">{{ announcement }}</p>
        </div>
      </RevealOnScroll>
    </div>
  </section>
</template>

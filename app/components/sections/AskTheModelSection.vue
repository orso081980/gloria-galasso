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
  <section id="ask" class="bg-surface/60 py-20" aria-labelledby="ask-title">
    <div class="mx-auto max-w-4xl px-5 sm:px-8">
      <SectionHeading
        id="ask-title"
        kicker="// inference"
        title="Ask the model about Gloria"
        intro="Not a real LLM, just a tiny (and honest) one. Pick a prompt and watch it stream. Every answer comes straight from her CV."
      />

      <RevealOnScroll class="overflow-hidden rounded-3xl border border-line bg-ink text-paper shadow-2xl">
        <div class="flex items-center gap-2 border-b border-white/10 px-5 py-3" aria-hidden="true">
          <span class="size-3 rounded-full bg-[#ff5f57]" />
          <span class="size-3 rounded-full bg-[#febc2e]" />
          <span class="size-3 rounded-full bg-[#28c840]" />
          <span class="ml-3 font-mono text-xs opacity-70">gloria-galasso-1b · inference</span>
        </div>

        <div class="p-5 sm:p-8">
          <p class="font-mono text-sm opacity-70" id="prompt-label">Choose a prompt:</p>
          <ul class="mt-3 flex flex-wrap gap-2" aria-labelledby="prompt-label">
            <li v-for="question in questions" :key="question.id">
              <button
                type="button"
                class="rounded-full border px-4 py-2 text-left text-sm font-medium transition hover:-translate-y-0.5"
                :class="
                  active?.id === question.id
                    ? 'border-transparent bg-accent text-ink'
                    : 'border-white/25 bg-white/5 text-paper hover:border-white/60'
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

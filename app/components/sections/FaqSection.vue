<script setup lang="ts">
import type { Question } from '~/domain/cv/types'

const { questions, copy } = useCv()
const { kicker, title, intro, terminalTitle, promptLabel, emptyState, confidenceLabel, sourceLabel } = copy.faq
const { shown, isStreaming, start } = useTextStream()

const active = ref<Question | null>(null)
// Screen readers get the finished answer once, instead of word-by-word chatter.
const announcement = ref('')
let announceTimer: ReturnType<typeof setTimeout> | undefined

function run(question: Question) {
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
  <section id="faq" class="py-20" aria-labelledby="faq-title">
    <div class="mx-auto max-w-6xl px-5 sm:px-8">
      <SectionHeading id="faq-title" large :kicker="kicker" :title="title" :intro="intro" />

      <RevealOnScroll class="overflow-hidden rounded-[2.5rem] bg-night text-night-fg shadow-2xl">
        <div class="flex items-center gap-2 border-b border-white/10 px-5 py-3" aria-hidden="true">
          <span class="size-3 rounded-full bg-[#ff5f57]" />
          <span class="size-3 rounded-full bg-[#febc2e]" />
          <span class="size-3 rounded-full bg-[#28c840]" />
          <span class="ml-3 font-mono text-xs opacity-70">{{ terminalTitle }}</span>
        </div>

        <div class="p-5 sm:p-8">
          <p id="prompt-label" class="font-mono text-sm opacity-80">{{ promptLabel }}</p>

          <!-- Every question is a "run" button: play icon on the left, filled when it is the active one. -->
          <ul class="mt-4 flex flex-wrap gap-3" aria-labelledby="prompt-label">
            <li v-for="question in questions" :key="question.id">
              <button
                type="button"
                class="group inline-flex items-center gap-2.5 rounded-full border-2 border-coral py-2 pl-2 pr-5 text-left text-sm font-semibold shadow-[0_4px_0_0_var(--coral)] transition active:translate-y-1 active:shadow-none sm:text-base"
                :class="
                  active?.id === question.id
                    ? 'translate-y-0.5 bg-coral text-night shadow-[0_2px_0_0_var(--coral)]'
                    : 'bg-white/5 text-night-fg hover:-translate-y-0.5 hover:bg-coral hover:text-night'
                "
                :aria-pressed="active?.id === question.id"
                @click="run(question)"
              >
                <span
                  class="grid size-8 shrink-0 place-items-center rounded-full text-xs transition"
                  :class="[
                    active?.id === question.id ? 'bg-night text-coral' : 'bg-coral text-night group-hover:bg-night group-hover:text-coral',
                    active ? '' : 'animate-pulse',
                  ]"
                >
                  <FaIcon :name="active?.id === question.id ? 'rotate-right' : 'play'" />
                </span>
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
                {{ confidenceLabel }}: {{ active.confidence.toFixed(2) }} · {{ sourceLabel }}: {{ active.source }}
              </p>
            </template>
            <p v-else class="opacity-60">
              {{ emptyState }}<span class="animate-blink">▍</span>
            </p>
          </div>

          <p class="sr-only" role="status" aria-live="polite">{{ announcement }}</p>

          <!-- Without JavaScript the buttons cannot run, so the answers are listed plainly. -->
          <noscript>
            <dl class="mt-8 space-y-4 text-sm">
              <div v-for="question in questions" :key="question.id">
                <dt class="font-semibold">{{ question.prompt }}</dt>
                <dd class="opacity-80">{{ question.answer }}</dd>
              </div>
            </dl>
          </noscript>
        </div>
      </RevealOnScroll>
    </div>
  </section>
</template>

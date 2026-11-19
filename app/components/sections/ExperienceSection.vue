<script setup lang="ts">
import { formatPeriod, formatPartialDate } from '~/domain/cv/period'
import type { ExperienceKind } from '~/domain/cv/types'

const { experience } = useCv()

const kindLabel: Record<ExperienceKind, string> = {
  industry: 'Industry',
  research: 'Research',
  policy: 'Policy & comms',
}
const kindTone: Record<ExperienceKind, string> = {
  industry: 'bg-violet-soft text-violet',
  research: 'bg-mint-soft text-mint',
  policy: 'bg-sun-soft text-ink',
}
const toneOf = (kind: ExperienceKind) => kindTone[kind]
const labelOf = (kind: ExperienceKind) => kindLabel[kind]
</script>

<template>
  <section id="experience" class="bg-surface/60 py-20" aria-labelledby="experience-title">
    <div class="mx-auto max-w-6xl px-5 sm:px-8">
      <SectionHeading
        id="experience-title"
        kicker="// training_log.txt"
        title="Where she has been deployed"
        intro="Newest first. From EU policy rooms to multimodal LLMs for clinical research."
      />

      <ol class="relative space-y-8 border-l-2 border-dashed border-line pl-6 sm:pl-10">
        <RevealOnScroll v-for="item in experience" :key="item.id" as="li" class="relative">
          <span class="absolute -left-[2.1rem] top-6 size-4 rounded-full border-4 border-paper bg-accent sm:-left-[3.1rem]" aria-hidden="true" />

          <article class="rounded-3xl border border-line bg-paper p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl sm:p-8">
            <div class="flex flex-wrap items-center gap-x-4 gap-y-2">
              <span class="rounded-full px-3 py-1 font-mono text-xs font-bold" :class="toneOf(item.kind)">
                {{ labelOf(item.kind) }}
              </span>
              <p class="font-mono text-sm text-muted">
                <time :datetime="item.period.start">{{ formatPartialDate(item.period.start) }}</time>
                –
                <time v-if="item.period.end" :datetime="item.period.end">{{ formatPartialDate(item.period.end) }}</time>
                <span class="sr-only"> ({{ formatPeriod(item.period) }})</span>
              </p>
            </div>

            <h3 class="mt-3 font-display text-2xl font-bold sm:text-3xl">{{ item.role }}</h3>
            <p class="mt-1 text-lg font-semibold text-violet">{{ item.organization }}</p>
            <p class="text-sm text-muted">{{ item.location }}</p>

            <p class="mt-4 text-lg">{{ item.summary }}</p>

            <ul v-if="item.highlights.length" class="mt-4 space-y-2.5">
              <li v-for="highlight in item.highlights" :key="highlight" class="flex gap-3">
                <span class="mt-2.5 size-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                <span>{{ highlight }}</span>
              </li>
            </ul>

            <p v-if="item.quip" class="mt-5 border-t border-dashed border-line pt-4 font-mono text-sm italic text-muted">
              <span aria-hidden="true">// </span>{{ item.quip }}
            </p>
          </article>
        </RevealOnScroll>
      </ol>
    </div>
  </section>
</template>

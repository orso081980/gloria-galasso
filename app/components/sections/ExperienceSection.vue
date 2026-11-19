<script setup lang="ts">
import { formatPartialDate, formatPeriod } from '~/domain/cv/period'
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
const kindNode: Record<ExperienceKind, string> = {
  industry: 'bg-violet',
  research: 'bg-mint',
  policy: 'bg-sun',
}
const toneOf = (kind: ExperienceKind) => kindTone[kind]
const labelOf = (kind: ExperienceKind) => kindLabel[kind]
const nodeOf = (kind: ExperienceKind) => kindNode[kind]

// Desktop: cards alternate. Even entries sit on the left of the line, odd ones on the right.
const isLeft = (index: number) => index % 2 === 0
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

      <ol class="relative">
        <!-- the line: on the left on mobile, in the middle on desktop -->
        <span
          class="absolute bottom-0 left-4 top-2 w-0.5 -translate-x-1/2 rounded-full bg-gradient-to-b from-accent via-violet to-mint lg:left-1/2"
          aria-hidden="true"
        />

        <RevealOnScroll
          v-for="(item, index) in experience"
          :key="item.id"
          as="li"
          class="relative pb-12 pl-12 last:pb-0 lg:grid lg:grid-cols-2 lg:gap-x-20 lg:pl-0"
        >
          <!-- node on the line -->
          <span
            class="absolute left-4 top-7 z-10 grid size-5 -translate-x-1/2 place-items-center rounded-full border-4 border-paper shadow-md ring-2 ring-line lg:left-1/2"
            :class="nodeOf(item.kind)"
            aria-hidden="true"
          >
            <span v-if="index === 0" class="absolute inline-flex size-full animate-ping rounded-full opacity-60" :class="nodeOf(item.kind)" />
          </span>

          <!-- the card -->
          <article
            class="relative rounded-3xl border border-line bg-paper p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl sm:p-8 lg:row-start-1"
            :class="[
              isLeft(index) ? 'lg:col-start-1' : 'lg:col-start-2',
              // little arrow pointing at the line
              'before:absolute before:top-8 before:size-4 before:rotate-45 before:border-line before:bg-paper',
              isLeft(index)
                ? 'before:-left-2 before:border-b before:border-l lg:before:-right-2 lg:before:left-auto lg:before:border-b-0 lg:before:border-l-0 lg:before:border-r lg:before:border-t'
                : 'before:-left-2 before:border-b before:border-l',
            ]"
          >
            <div class="flex flex-wrap items-center gap-x-4 gap-y-2 lg:hidden">
              <span class="rounded-full px-3 py-1 font-mono text-xs font-bold" :class="toneOf(item.kind)">
                {{ labelOf(item.kind) }}
              </span>
              <p class="font-mono text-sm text-muted">{{ formatPeriod(item.period) }}</p>
            </div>

            <h3 class="mt-3 font-display text-2xl font-bold sm:text-3xl lg:mt-0">{{ item.role }}</h3>
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

          <!-- desktop only: the date sits on the opposite side of the line -->
          <div
            class="hidden lg:row-start-1 lg:block lg:pt-5"
            :class="isLeft(index) ? 'lg:col-start-2 lg:text-left' : 'lg:col-start-1 lg:text-right'"
          >
            <p class="font-display text-3xl font-black leading-tight">
              <time :datetime="item.period.start">{{ formatPartialDate(item.period.start) }}</time>
              <span class="mx-1 text-muted" aria-hidden="true">→</span>
              <span class="sr-only"> to </span>
              <time v-if="item.period.end" :datetime="item.period.end">{{ formatPartialDate(item.period.end) }}</time>
              <span v-else>Present</span>
            </p>
            <span class="mt-3 inline-block rounded-full px-3 py-1 font-mono text-xs font-bold" :class="toneOf(item.kind)">
              {{ labelOf(item.kind) }}
            </span>
          </div>
        </RevealOnScroll>
      </ol>
    </div>
  </section>
</template>

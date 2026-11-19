<script setup lang="ts">
import { formatPeriod } from '~/domain/cv/period'

const { education } = useCv()
</script>

<template>
  <section id="education" class="mx-auto max-w-6xl px-5 py-20 sm:px-8" aria-labelledby="education-title">
    <SectionHeading
      id="education-title"
      kicker="// pre-training"
      title="Education"
      intro="Three degrees, three countries, one consistent curriculum: language, and what people do with it."
    />

    <div class="grid gap-6 lg:grid-cols-3">
      <RevealOnScroll v-for="(item, index) in education" :key="item.id" as="div" :delay="index * 110" class="h-full">
        <article class="flex h-full flex-col rounded-3xl border border-line bg-surface p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
          <p class="font-mono text-sm text-muted">{{ formatPeriod(item.period) }}</p>
          <h3 class="mt-2 font-display text-xl font-bold leading-snug">{{ item.degree }}</h3>
          <p class="mt-2 font-semibold text-violet">{{ item.institution }}</p>
          <p class="text-sm text-muted">{{ item.location }}</p>

          <p v-if="item.grade" class="mt-4 inline-flex w-fit rounded-full bg-sun-soft px-3 py-1 text-sm font-bold">
            {{ item.grade }}
          </p>

          <ul class="mt-4 space-y-2 text-sm">
            <li v-for="highlight in item.highlights" :key="highlight" class="flex gap-2.5">
              <span class="mt-2 size-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
              <span>{{ highlight }}</span>
            </li>
          </ul>
        </article>
      </RevealOnScroll>
    </div>
  </section>
</template>
